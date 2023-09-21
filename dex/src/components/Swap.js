/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message, Col, Row } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import tokenList from "../tokenList.json";

import { useSendTransaction, useWaitForTransaction, erc20ABI } from "wagmi";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import qs from "qs";
import { ethers } from "ethers";
//import axios from "axios";
//import Web3 from "web3";
//import { Web3Modal } from "@web3modal";

const config = {
  apiKey: "TlfW-wkPo26fcc7FPw_3xwVQiPwAmI3T", //process.env.ALCHEMY_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);
var zeroxapi = "https://api.0x.org";
//var zeroxapi = "https://goerli.api.0x.org/";
//const axiosInstance = axios.create();

function Swap(props) {
  const { address, isConnected } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [slippage, setSlippage] = useState(2.5);
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [tokenOneBalance, setTokenOneBalance] = useState(null);
  const [tokenTwoBalance, setTokenTwoBalance] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [prices, setPrices] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [txDetails, setTxDetails] = useState({
    to: null,
    data: null,
    value: null,
  });

  const { data, sendTransaction } = useSendTransaction({
    request: {
      from: address,
      to: String(txDetails.to),
      data: String(txDetails.data),
      value: String(txDetails.value),
      gasPrice: null,
      gas: String(txDetails.gas),
    },
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  function handleSlippageChange(e) {
    setSlippage(e.target.value);
  }

  const handleCustomSlippageChange = (e) => {
    const customSlippage = parseFloat(e.target.value);
    if (!isNaN(customSlippage)) {
      setSlippage(customSlippage);
    }
  };

  function changeAmount(e) {
    setTokenOneAmount(e.target.value);
    if (e.target.value && prices) {
      setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2));
    } else {
      setTokenTwoAmount(null);
    }
  }

  function switchTokens() {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
    fetchPrices(two.address, one.address);
  }

  function openModal(asset) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(i) {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    if (changeToken === 1) {
      setTokenOne(tokenList[i]);
      fetchPrices(tokenList[i].address, tokenTwo.address);
    } else {
      setTokenTwo(tokenList[i]);
      fetchPrices(tokenOne.address, tokenList[i].address);
    }
    setIsOpen(false);
  }

  async function fetchGas() {
    setIsFetching(true);
    try {
      const blockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(blockNumber);
    } catch (error) {
      console.error("Failed to fetch block:", error);
    } finally {
      setIsFetching(false);
    }
  }

  async function fetchBalances() {
    try {
      let tokenAddress = [tokenOne.address];
      let data = await alchemy.core.getTokenBalances(address, tokenAddress);

      data.tokenBalances.find((item) => {
        let balance = Number(
          Utils.formatUnits(item.tokenBalance, "ether")
        ).toFixed(3);
        if (
          item.tokenBalance ===
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        ) {
          setTokenOneBalance("0.000");
        } else {
          setTokenOneBalance(balance);
        }
        console.log(`balance1: ${balance}`);
        return item.tokenBalance;
      });

      tokenAddress = [tokenTwo.address];
      data = await alchemy.core.getTokenBalances(address, tokenAddress);

      data.tokenBalances.find((item) => {
        let balance = Number(
          Utils.formatUnits(item.tokenBalance, "ether")
        ).toFixed(3);
        if (
          item.tokenBalance ===
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        ) {
          setTokenTwoBalance("0.000");
        } else {
          setTokenTwoBalance(balance);
        }
        console.log(`balance2: ${balance}`);
        return item.tokenBalance;
      });
    } catch (error) {
      console.error("An error occurred while fetching balances:", error);
    }
  }

  async function fetchPrices(one, two) {
    try {
      console.log("Fetching Prices...");

      const amount = tokenOneAmount ? tokenOneAmount : 10 * 10 ** 18;
      const headers = { "0x-api-key": "0ad3443e-19ec-4e03-bbdb-8c5492c4ad7d" };
      let params = {
        sellToken: one,
        buyToken: two,
        sellAmount: amount.toString(),
        takerAddress: address,
      };

      const response = await fetch(
        zeroxapi + `/swap/v1/price?${qs.stringify(params)}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const priceJSON = await response.json();
      console.log(`priceJSON: ${JSON.stringify(priceJSON)}`);

      if (!priceJSON.sellAmount || !priceJSON.buyAmount || !priceJSON.price) {
        throw new Error("Missing required fields in API response");
      }

      const data = {
        tokenOneAmount: priceJSON.sellAmount,
        tokenTwoAmount: priceJSON.buyAmount,
        ratio: priceJSON.price,
        estimatedGas: priceJSON.estimatedGas,
      };

      setPrices(data);
      setTxDetails(priceJSON);
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  }

  async function fetchQuote() {
    try {
      console.log("Fetching Quote...");

      let amount = 10 * 10 ** 18;
      const headers = { "0x-api-key": "0ad3443e-19ec-4e03-bbdb-8c5492c4ad7d" };
      const params = {
        sellToken: tokenOne.address,
        buyToken: tokenTwo.address,
        sellAmount: amount.toString(),
      };
      const response = await fetch(
        zeroxapi + `/swap/v1/quote?${qs.stringify(params)}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const quoteJSON = await response.json();
      console.log(`quoteJSON: ${JSON.stringify(quoteJSON)}`);

      setTxDetails(quoteJSON);

      /*       var proxy = quoteJSON.allowanceTarget;
      var amountstr = amount.toString();
      const ERC20Contract = new ethers.Contract(
        tokenOne.address,
        erc20ABI,
        address
      );
      const approval = await ERC20Contract.approve(proxy, amountstr);
      await approval.wait(); */

      /*       const web3 = new Web3(connection);
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const userWallet = await signer.getAddress();

      const txParams = {
        ...quoteJSON,
        from: address,
        to: quoteJSON.to,
        value: quoteJSON.value.toString(16),
        gasPrice: null,
        gas: quoteJSON.gas,
      };

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [txParams],
      }); */
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  }

  /*   async function fetchDexSwap() {
    const allowance = await axios.get(
      `https://api.1inch.io/v5.0/1/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`
    );

    if (allowance.data.allowance === "0") {
      const approve = await axios.get(
        `https://api.1inch.io/v5.0/1/approve/transaction?tokenAddress=${tokenOne.address}`
      );

      setTxDetails(approve.data);
      console.log("not approved");
      return;
    }

    const tx = await axios.get(
      `https://api.1inch.io/v5.0/1/swap?fromTokenAddress=${
        tokenOne.address
      }&toTokenAddress=${tokenTwo.address}&amount=${tokenOneAmount.padEnd(
        tokenOne.decimals + tokenOneAmount.length,
        "0"
      )}&fromAddress=${address}&slippage=${slippage}`
    );

    let decimals = Number(`1E${tokenTwo.decimals}`);
    setTokenTwoAmount((Number(tx.data.toTokenAmount) / decimals).toFixed(2));

    setTxDetails(tx.data.tx);
  } */

  useEffect(() => {
    fetchPrices(tokenList[0].address, tokenList[1].address);
  }, []);

  useEffect(() => {
    fetchBalances();
  }, [tokenOne, tokenTwo]);

  useEffect(() => {
    const intervalId = setInterval(fetchGas, 12500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (txDetails.to && isConnected) {
      sendTransaction();
    }
  }, [txDetails, isConnected, sendTransaction]);

  useEffect(() => {
    messageApi.destroy();

    if (isLoading) {
      messageApi.open({
        type: "loading",
        content: "Transaction is Pending...",
        duration: 0,
      });
    }
  }, [isLoading, messageApi]);

  useEffect(() => {
    messageApi.destroy();
    if (isSuccess) {
      messageApi.open({
        type: "success",
        content: "Transaction Successful",
        duration: 1.5,
      });
    } else if (txDetails.to) {
      messageApi.open({
        type: "error",
        content: "Transaction Failed",
        duration: 1.5,
      });
    }
  }, [isSuccess, txDetails.to, messageApi]);

  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
        <div>
          <Input
            placeholder="Custom slippage"
            style={{ width: 250 }}
            addonAfter="%"
            onChange={handleCustomSlippageChange}
          />
        </div>
      </div>
    </>
  );

  function renderJsonObject(jsonObject) {
    if (jsonObject) {
      return (
        <ul>
          {Object.entries(jsonObject).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong>{" "}
              {typeof value === "object"
                ? renderJsonObject(value)
                : String(value)}
            </li>
          ))}
        </ul>
      );
    }
  }

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        {/*         <div className="modalContent">
          Paste in a token address or select from the list below
          <Input placeholder="0x..." value={newToken} onChange={addTokenList} />
        </div> */}
        <div className="modalContent">
          {tokenList?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(i)}
              >
                <img src={e.img} alt={e.ticker} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      <div className="tradeBox">
        <div className="tradeBoxHeader">
          <h4 className="">AntiMEV Swap</h4>
          <Popover
            content={settings}
            title="Settings"
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined className="cog" />
          </Popover>
        </div>

        <div className="inputs">
          <Input
            placeholder="0"
            value={tokenOneAmount}
            onChange={changeAmount}
            disabled={!prices}
          />
          <Input placeholder="0" value={tokenTwoAmount} disabled={true} />

          <div className="switchButton" onClick={switchTokens}>
            <ArrowDownOutlined className="switchArrow" />
          </div>

          <div className="assetOne" onClick={() => openModal(1)}>
            <img src={tokenOne.img} alt="assetOneLogo" className="assetLogo" />
            {tokenOne.ticker}
            <DownOutlined />
          </div>

          <div className="balanceOne">Balance: {tokenOneBalance}</div>

          <div className="assetTwo" onClick={() => openModal(2)}>
            <img src={tokenTwo.img} alt="assetOneLogo" className="assetLogo" />
            {tokenTwo.ticker}
            <DownOutlined />
          </div>

          <div className="balanceTwo">Balance: {tokenTwoBalance}</div>
        </div>

        <div
          className="swapButton"
          disabled={!tokenOneAmount || !isConnected}
          onClick={fetchQuote}
        >
          Swap
        </div>

        <Popover
          content={renderJsonObject(txDetails)}
          //title="Swap Details"
          trigger="click"
          placement="bottom"
        >
          <button className="swapButton">Show Details</button>
        </Popover>

        <Row gutter={78}>
          <Col>
            <div className="data">
              {prices && prices.ratio
                ? `1 ${tokenOne.ticker} = ${parseFloat(prices.ratio).toFixed(
                    3
                  )} ${tokenTwo.ticker}`
                : "Fetching Price..."}
            </div>
            <div className="data">
              {prices && prices.estimatedGas
                ? `Estimated Gas: ${prices.estimatedGas} gwei`
                : "Fetching Gas..."}
            </div>
          </Col>

          <Col>
            <div className="data">
              Block Number:{" "}
              <span style={{ color: isFetching ? "#3ADA40" : "#089981" }}>
                {blockNumber}
              </span>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Swap;
