/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message, Col, Row } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import tokenList from "../tokenList.json";
import ConnectButton from "./Connect";
import Ticker from "./Ticker";
import Charts from "./Charts";

import {
  useAccount,
  useConnect,
  erc20ABI,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { ethers } from "ethers";
import qs from "qs";

const config = {
  apiKey: "TlfW-wkPo26fcc7FPw_3xwVQiPwAmI3T",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);
var zeroxapi = "https://api.0x.org";
//var zeroxapi = "https://goerli.api.0x.org/";

export default function Swap(props) {
  const { address, isConnected } = props;
  const { connector } = useAccount();
  const { connect, connectors } = useConnect();

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
  const [blockNumber, setBlockNumber] = useState(null);
  const [price, setPrice] = useState(null);
  const [txDetails, setTxDetails] = useState({
    from: null,
    to: null,
    data: null,
    value: null,
  });

  const { prep } = usePrepareSendTransaction({
    to: txDetails?.to, // The address of the contract to send call data to, in this case 0x Exchange Proxy
    data: txDetails?.data, // The call data required to be sent to the to contract address.
  });

  const { data, sendTransaction } = useSendTransaction({
    request: {
      from: address,
      to: String(txDetails.to),
      data: String(txDetails.data),
      value: String(txDetails.value),
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
    if (e.target.value && price) {
      setTokenTwoAmount((e.target.value * price.ratio).toFixed(2));
    } else {
      setTokenTwoAmount(null);
    }
  }

  function switchTokens() {
    setPrice(null);
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
    setPrice(null);
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

  async function getBlock() {
    setIsFetching(true);
    try {
      const blockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(blockNumber);
    } catch (error) {
      console.error("Failed to get block:", error);
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
        return item.tokenBalance;
      });
    } catch (error) {
      console.error("An error occurred while fetching balances:", error);
    }
  }

  async function fetchPrices(one, two) {
    try {
      console.log("Fetching price...");

      const amount = tokenOneAmount ? tokenOneAmount : 100 * 10 ** 18;
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

      const res = {
        ...priceJSON,
        tokenOneAmount: priceJSON.sellAmount,
        tokenTwoAmount: priceJSON.buyAmount,
        ratio: priceJSON.price,
        estimatedGas: priceJSON.estimatedGas,
      };

      setPrice(res);
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  }

  async function fetchQuote() {
    try {
      console.log("Fetching Quote...");

      let amount = 100 * 10 ** 18;
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

      const res = {
        from: address,
        to: quoteJSON.to,
        data: quoteJSON.data,
        value: quoteJSON.value,
        ...quoteJSON,
      };
      setTxDetails(res);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
    executeSwap();
  }

  async function executeSwap() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider);
  
      const signer = provider.getSigner();
      console.log(signer);
  
      const ERC20Contract = new ethers.Contract(
        tokenOne.address,
        erc20ABI,
        signer
      );
  
      const allowance = await ERC20Contract.allowance(tokenOne.address, address);
      console.log(`allowance: ${allowance}`);
  
      const amount = ethers.utils.parseUnits(tokenOneAmount, tokenOne.decimals);
      const approval = await ERC20Contract.approve(
        txDetails.allowanceTarget,
        amount
      );
      await approval.wait();
      console.log(`approval: ${JSON.stringify(approval)}`);
    } catch (error) {
      console.error(error);
    }

    const txParams = {
      ...txDetails,
      from: address,
      to: txDetails.to,
      value: txDetails.value,
      gas: null, // txDetails.gas,
      gasPrice: txDetails.gasPrice,
    };
    console.log(`txParams: ${JSON.stringify(txParams)}`);

    /*      await window.ethereum.request({
       method: "eth_sendTransaction",
       params: [txParams],
     }); */
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
    const intervalId = setInterval(getBlock, 12500);
    return () => clearInterval(intervalId);
  }, [getBlock]);

  useEffect(() => {
    if (txDetails.to && isConnected) {
      //sendTransaction();
    }
  }, [txDetails]);

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
  }, [isSuccess]);

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
      <div className="swap">
        <div className="ticker">
          <Ticker />
        </div>

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
              disabled={!price}
            />
            <Input placeholder="0" value={tokenTwoAmount} disabled={true} />

            <div className="switchButton" onClick={switchTokens}>
              <ArrowDownOutlined className="switchArrow" />
            </div>

            <div className="assetOne" onClick={() => openModal(1)}>
              <img
                src={tokenOne.img}
                alt="assetOneLogo"
                className="assetLogo"
              />
              {tokenOne.ticker}
              <DownOutlined />
            </div>

            <div className="balanceOne">Balance: {tokenOneBalance}</div>
            <div className="messageOne">You pay</div>

            <div className="valueOne">Value: $</div>

            <div className="assetTwo" onClick={() => openModal(2)}>
              <img
                src={tokenTwo.img}
                alt="assetOneLogo"
                className="assetLogo"
              />
              {tokenTwo.ticker}
              <DownOutlined />
            </div>

            <div className="balanceTwo">Balance: {tokenTwoBalance}</div>
            <div className="messageTwo">You receive</div>
          </div>

          <div className="data">
            {price
              ? `1 ${tokenOne.ticker} = ${parseFloat(price.ratio).toFixed(3)} ${
                  tokenTwo.ticker
                }`
              : "Fetching Price..."}
          </div>

          {isConnected ? (
            <div
              className="swapButton"
              disabled={!tokenOneAmount}
              onClick={fetchQuote}
            >
              Swap
            </div>
          ) : (
            <ConnectButton />
          )}

          <Popover
            content={renderJsonObject(price)}
            title="Aggregator Details"
            trigger="click"
            placement="bottom"
          >
            <button className="swapButton">Show Details</button>
          </Popover>

          <Row gutter={140}>
            <Col>
              <div className="data">
                {price
                  ? `Estimated Gas: ${price.estimatedGas} gwei`
                  : "Fetching Gas..."}
              </div>
            </Col>

            <Col>
              <div className="data">
                Block:{" "}
                <span style={{ color: isFetching ? "#3ADA40" : "#089981" }}>
                  {blockNumber}
                </span>
              </div>
            </Col>
          </Row>
        </div>

        <div className="chart">
          <Charts />
        </div>
      </div>
    </>
  );
}
