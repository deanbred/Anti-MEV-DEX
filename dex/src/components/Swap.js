import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message, Grid, Col, Row } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import tokenList from "../tokenList3.json";
import axios from "axios";
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import qs from "qs";
//import {erc20ABI} from "wagmi";
//import Web3 from "web3";

const config = {
  apiKey: process.env.ALCHEMY_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);
//var zeroxapi = "https://api.0x.org";
var zeroxapi = "https://goerli.api.0x.org/";
//Goerli Sources: https://goerli.api.0x.org/swap/v1/sources

function Swap(props) {
  const { address, isConnected } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [slippage, setSlippage] = useState(2.5);
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [tokenOneBalance, setTokenOneBalance] = useState(tokenList[0].address);
  const [tokenTwoBalance, setTokenTwoBalance] = useState(tokenList[1].address);
  const [isOpen, setIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [prices, setPrices] = useState(null);
  const [gasPriceGwei, setGasPriceGwei] = useState(null);
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
    },
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  function handleSlippageChange(e) {
    setSlippage(e.target.value);
  }

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
    getBalanceOne();
    getBalanceTwo();
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
      getBalanceOne();
    } else {
      setTokenTwo(tokenList[i]);
      fetchPrices(tokenOne.address, tokenList[i].address);
      getBalanceTwo();
    }
    setIsOpen(false);
  }

  async function fetchGas() {
    setIsFetching(true);

    const blockNumber = await alchemy.core.getBlockNumber();
    setBlockNumber(blockNumber);

    const gasPrice = await alchemy.core.getGasPrice();
    let gasPriceGwei = gasPrice.toString();
    setGasPriceGwei(gasPriceGwei);

    setIsFetching(false);

    /*     const gasEstimate = await alchemy.core.estimateGas({
      // Wrapped ETH address
      to: "0x657D378e66B5E28143C88D85B116C053b8455509",
      // `function deposit() payable`
      data: "0xd0e30db0",
      // 1 ether
      value: Utils.parseEther("1.0"),
    });
    let gasEstimateEther = gasEstimate.toString();
    console.log(`Gas Estimate (ether): ${gasEstimateEther}`); */
  }

  async function getBalanceOne() {
    const tokenContractAddresses = [tokenOne.address];
    const data = await alchemy.core.getTokenBalances(
      address,
      tokenContractAddresses
    );

    data.tokenBalances.find((item) => {
      let formatbalance = Number(Utils.formatUnits(item.tokenBalance, "ether"));
      let balance = formatbalance.toFixed(3);
      if (
        item.tokenBalance ===
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ) {
        setTokenOneBalance("0");
      } else {
        setTokenOneBalance(balance);
      }
      console.log(`balance1: ${balance}`);
      return item.tokenBalance;
    });
  }

  async function getBalanceTwo() {
    const tokenContractAddresses = [tokenTwo.address];
    const data = await alchemy.core.getTokenBalances(
      address,
      tokenContractAddresses
    );

    data.tokenBalances.find((item) => {
      let formatbalance = Number(Utils.formatUnits(item.tokenBalance, "ether"));
      let balance = formatbalance.toFixed(3);
      if (
        item.tokenBalance ===
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ) {
        setTokenTwoBalance("0");
      } else {
        setTokenTwoBalance(balance);
      }
      console.log(`balance2: ${balance}`);
      return item.tokenBalance;
    });
  }

  async function fetchPrices(one, two) {
    const res = await axios.get(`http://localhost:3001/tokenPrice`, {
      params: { addressOne: one, addressTwo: two },
    });

    setPrices(res.data);
    console.log(`prices in res.data: ${res.data}`);
  }

  async function fetchQuote(one, two) {
    console.log("Getting Price");

    let amount = tokenOneAmount.padEnd(
      one.decimals + tokenOneAmount.length,
      "0"
    );

    const params = {
      sellToken: one.address,
      buyToken: two.address,
      sellAmount: amount,
    };
    const response = await fetch(
      zeroxapi + `/swap/v1/price?${qs.stringify(params)}`
    );
    const sources = await fetch(
      zeroxapi + `/swap/v1/quote?${qs.stringify(params)}`
    );
    var swapPriceJSON = await response.json();
    console.log(`swapPriceJSON: ${swapPriceJSON}`);
    var swapOrders = await sources.json();
    try {
      await swapOrders.orders.find((item) => {
        //document.getElementById("defisource").innerHTML = item.source;
        console.log(`0x defi source: ${item.source}`);
        return item.source;
      });
    } catch (error) {
      // document.getElementById("defisource").innerHTML = "Pool Not Available";
    }
    var rawvalue = swapOrders.buyAmount / 10 ** 18;
    var value = rawvalue.toFixed(2);
    console.log(`value: ${value}`);
    console.log(`estimatedGas: ${swapPriceJSON.estimatedGas}`);
    //document.getElementById("to_amount").innerHTML = value;
    //document.getElementById("gas_estimate").innerHTML =
    //swapPriceJSON.estimatedGas;
  }

  async function fetchDexSwap() {
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
  }

  useEffect(() => {
    fetchPrices(tokenList[0].address, tokenList[1].address);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(fetchGas, 12500); //
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getBalanceOne();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getBalanceTwo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*   useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchGas();
    }, 1000);
    return () => clearTimeout(delayDebounce);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hold]); */

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
      </div>
    </>
  );

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
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
          onClick={fetchDexSwap}
        >
          Swap
        </div>

        <Row gutter={48}>
          <Col flex={3}>
            <div className="data">
              Gas Price:{" "}
              <span style={{ color: isFetching ? "#3ADA40" : "#089981" }}>
                {gasPriceGwei} gwei{" "}
              </span>{" "}
            </div>
          </Col>

          <Col flex={2}>
            <div className="data" x>
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
