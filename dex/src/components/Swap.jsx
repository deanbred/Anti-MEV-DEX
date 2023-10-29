/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message, Col, Row, Button } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import tokenList from "../tokenListGoerli.json";
import { getContractAddressesForChainOrThrow } from "@0x/contract-addresses";
import ConnectButton from "./Connect";
import Ticker from "./Ticker";
import Charts from "./Charts";
import Logo from "../logo.png";

import {
  erc20ABI,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import bgImage from "../styles/circuit.jpg";

import { Alchemy, Network, Utils } from "alchemy-sdk";
import { ethers } from "ethers";
import qs from "qs";

const config = {
  apiKey: "TlfW-wkPo26fcc7FPw_3xwVQiPwAmI3T",
  //network: Network.ETH_MAINNET,
  //apiKey: "la9mAkNVUg51xj0AjxrGdIxSk1yBcpGg",
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(config);
//var zeroxapi = "https://api.0x.org";
//var zeroxapi = "https://polygon.api.0x.org/";
//var zeroxapi = "https://arbitrum.api.0x.org/";
//var zeroxapi = "https://optimism.api.0x.org/";
var zeroxapi = "https://goerli.api.0x.org/";

export default function Swap(props) {
  const { address, connector, isConnected, client } = props;

  //const properties = Object.getOwnPropertyNames(client.chain);
  //console.log(`client.chain properties: ${properties}`);
  console.log(`address: ${address}`);
  console.log(`isConnected: ${isConnected}`);
  console.log(`Chain:${client.chain.name} Id:${client.chain.id}`);
  //console.log(`nativeCurrency: ${JSON.stringify(client.chain.nativeCurrency)}`);
  //console.log(`contracts: ${JSON.stringify(client.chain.contracts)}`);

  const [messageApi, contextHolder] = message.useMessage();
  const [slippage, setSlippage] = useState(1.5);
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [tokenOneBalance, setTokenOneBalance] = useState(null);
  const [tokenTwoBalance, setTokenTwoBalance] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [blockNumber, setBlockNumber] = useState(null);
  const [price, setPrice] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const [txDetails, setTxDetails] = useState({
    from: null,
    to: null,
    data: null,
    value: null,
    gasPrice: null,
  });

  const { config } = usePrepareSendTransaction({
    from: txDetails?.from,
    to: txDetails?.to, // send call data to 0x Exchange Proxy
    data: txDetails?.data,
    value: txDetails?.value,
    gasPrice: txDetails?.gasPrice,
  });

  const { data, sendTransaction } = useSendTransaction(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  /* 1. Read from erc20, does spender (0x Exchange Proxy) have allowance?
    const { data: allowance, readContract, refetch } = useContractRead({
    address: tokenOne.address,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address, exchangeProxy],
  }); 

  // 2. (only if no allowance): write to erc20, approve 0x Exchange Proxy to spend max integer
  const { config2 } = usePrepareContractWrite({
    address: tokenOne.address,
    abi: erc20ABI,
    functionName: "approve",
    args: [exchangeProxy, MAX_ALLOWANCE],
  });

  const {
    data: writeContractResult,
    writeAsync: approveAsync,
    error,
  } = useContractWrite(config2);

  const { isLoading: isApproving } = useWaitForTransaction({
    hash: writeContractResult ? writeContractResult.hash : undefined,
    onSuccess(data) {
      refetch();
    },
  }); */

  function handleSlippageChange(e) {
    const parsedSlippage = parseFloat(e.target.value);
    if (!isNaN(parsedSlippage)) {
      setSlippage(parsedSlippage);
      console.log(`slippage: ${parsedSlippage}`);
    }
  }

  function changeAmount(e) {
    setTokenOneAmount(e.target.value);
    if (e.target.value && price) {
      setTokenTwoAmount((e.target.value * price.ratio).toFixed(3));
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

  function setMax() {
    setTokenOneAmount(tokenOneBalance);
    setTokenTwoAmount((tokenOneBalance * price.ratio).toFixed(3));
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

  async function getEthPrice() {
    try {
      console.log("Fetching ETH price...");

      const amount = 1 * 10 ** 18;
      const headers = { "0x-api-key": "0ad3443e-19ec-4e03-bbdb-8c5492c4ad7d" };
      let params = {
        sellToken: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        buyToken: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        sellAmount: amount.toString(),
        //takerAddress: address,
      };

      const query = `${zeroxapi}/swap/v1/price?${qs.stringify(
        params
      )}, ${qs.stringify(headers)}`;
      console.log(`query: ${query}`);

      const response = await fetch(
        zeroxapi + `/swap/v1/price?${qs.stringify(params)}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const priceETH = await response.json();
      console.log(`priceETH: ${JSON.stringify(priceETH)}`);

      setEthPrice(priceETH.price);
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  }

  async function fetchBalances() {
    try {
      let tokenAddress = [tokenOne.address];
      let data = await alchemy.core.getTokenBalances(address, tokenAddress);

      console.log(`data: ${JSON.stringify(data)}`);
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

      const amount = tokenOneAmount ? tokenOneAmount : 10 * 10 ** 18;
      const headers = { "0x-api-key": "0ad3443e-19ec-4e03-bbdb-8c5492c4ad7d" };
      let params = {
        sellToken: one,
        buyToken: two,
        sellAmount: amount.toString(),
        //takerAddress: address,
      };

      const query = `${zeroxapi}/swap/v1/price?${qs.stringify(
        params
      )}, ${qs.stringify(headers)}`;
      console.log(`query: ${query}`);

      const response = await fetch(
        zeroxapi + `/swap/v1/price?${qs.stringify(params)}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const priceJSON = await response.json();
      console.log(`priceJSON: ${JSON.stringify(priceJSON)}`);

      const data = {
        ...priceJSON,
        tokenOneAmount: priceJSON.sellAmount,
        tokenTwoAmount: priceJSON.buyAmount,
        ratio: priceJSON.price,
        estimatedGas: priceJSON.estimatedGas,
      };

      setPrice(data);
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  }

  async function fetchQuote() {
    try {
      console.log("Fetching Quote...");

      let amount = tokenOneAmount ? tokenOneAmount : 10 * 10 ** 18;
      amount = ethers.utils.parseUnits(amount, tokenOne.decimals);
      console.log(`amount: ${amount}`);
      const headers = { "0x-api-key": "0ad3443e-19ec-4e03-bbdb-8c5492c4ad7d" };
      const params = {
        sellToken: tokenOne.address,
        buyToken: tokenTwo.address,
        sellAmount: amount.toString(),
        //takerAddress: address,
        feeRecipient: "0xd577F7b3359862A4178667347F4415d5682B4E85", //dev
        buyTokenPercentageFee: 0.015,
        slippagePercentage: slippage / 100,
      };

      const query = `${zeroxapi}/swap/v1/price?${qs.stringify(
        params
      )}, ${qs.stringify(headers)}`;
      console.log(`query: ${query}`);

      const response = await fetch(
        zeroxapi + `/swap/v1/quote?${qs.stringify(params)}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const quoteJSON = await response.json();
      console.log(`quoteJSON: ${JSON.stringify(quoteJSON)}`);

      const quote = {
        from: address,
        to: quoteJSON.to,
        data: quoteJSON.data,
        value: quoteJSON.value,
        ...quoteJSON,
      };
      setTxDetails(quote);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
    setIsSwapModalOpen(true);
  }

  async function executeSwap() {
    try {
      setIsSwapModalOpen(false);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider);

      const signer = provider.getSigner();
      console.log(signer);

      const ERC20Contract = new ethers.Contract(
        tokenOne.address,
        erc20ABI,
        signer
      );

      const allowance = await ERC20Contract.allowance(
        tokenOne.address,
        address
      );
      console.log(`allowance: ${allowance}`);

      const amount = ethers.utils.parseUnits(tokenOneAmount, tokenOne.decimals);
      const approval = await ERC20Contract.approve(
        txDetails.allowanceTarget,
        amount
      );
      await approval.wait(1);
      console.log(`approval: ${JSON.stringify(approval)}`);
    } catch (error) {
      console.error(error);
    }

    sendTransaction && sendTransaction();
  }

  useEffect(() => {
    fetchPrices(tokenList[0].address, tokenList[1].address);
  }, []);

  useEffect(() => {
    fetchBalances();
  }, [tokenOne, tokenTwo, isSuccess]);

  useEffect(() => {
    const intervalId = setInterval(getBlock, 12500);
    return () => clearInterval(intervalId);
  }, [getBlock]);

  useEffect(() => {
    const intervalId2 = setInterval(getEthPrice, 12500);
    return () => clearInterval(intervalId2);
  }, [getEthPrice]);

  useEffect(() => {
    if (txDetails.to && isConnected) {
      sendTransaction && sendTransaction();
    }
  }, [txDetails.to]);

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
        duration: 2.0,
      });
      fetchBalances();
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
      <Radio.Group value={slippage} onChange={handleSlippageChange}>
        <Radio.Button value={0.5}>0.5%</Radio.Button>
        <Radio.Button value={2.5}>2.5%</Radio.Button>
        <Radio.Button value={5}>5.0%</Radio.Button>
        <Radio.Button value={10}>10.0%</Radio.Button>
        <Radio.Button value={25}>25.0%</Radio.Button>
        <Radio.Button value={50}>50.0%</Radio.Button>
      </Radio.Group>
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

      <Modal
        open={isSwapModalOpen}
        footer={null}
        onCancel={() => setIsSwapModalOpen(false)}
        title="Review Swap"
      >
        <div className="modalContent">
          <div className="assetReview">
            Send: {(txDetails.sellAmount / 10 ** tokenOne.decimals).toFixed(3)}
            <img src={tokenOne.img} alt="assetOneLogo" className="assetLogo" />
            {tokenOne.ticker}
          </div>
          <div className="assetReview">
            Recieve:{" "}
            {(txDetails.buyAmount / 10 ** tokenTwo.decimals).toFixed(3)}
            <img src={tokenTwo.img} alt="assetOneLogo" className="assetLogo" />
            {tokenTwo.ticker}
          </div>

          <ul>
            <li>Estimated Price Impact: {txDetails.estimatedPriceImpact} %</li>
            <li>Estimated Gas: {txDetails.estimatedGas} gwei</li>
            <li>Protocol Fee: {txDetails.protocolFee}</li>
            <li>Gross Price: {(txDetails.grossPrice * 1).toFixed(5)}</li>
            <li>
              SellTokenToEthRate:{" "}
              {(txDetails.sellTokenToEthRate * 1).toFixed(3)}
            </li>
            <li>
              BuyTokenToEthRate: {(txDetails.buyTokenToEthRate * 1).toFixed(3)}
            </li>
            <li>Max Slippage: {slippage} %</li>
          </ul>
        </div>
        <div
          className="executeButton"
          disabled={!txDetails}
          onClick={executeSwap}
        >
          Execute Swap
        </div>
      </Modal>

      <div
        className="swap"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: "top center",
          //backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="ticker">
          <Ticker />
        </div>
        <div className="tradeBox">
          <div className="tradeBoxHeader">
            <div className="leftH">
              <img
                src={Logo}
                alt="logo"
                height={48}
                width={48}
                className="logo"
              />
              <Link to="/" className="link">
                <div className="">Market</div>
              </Link>
              <Link to="/limit" className="link">
                <div className="headerItem opacity">Limit</div>
              </Link>
            </div>
            <Popover
              content={settings}
              title="Slippage"
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
            <div className="messageOne">You send</div>

            <div className="valueOne">
              {price && ethPrice && tokenOneAmount
                ? `Value: $${parseFloat(
                    tokenOneAmount * (ethPrice / price.sellTokenToEthRate)
                  ).toFixed(2)}`
                : "Value:"}
            </div>

            <Button className="maxButton" onClick={setMax}>
              MAX
            </Button>

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

          <div className="convert">
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
              Market Swap
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

          <Row gutter={190}>
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

{/*         <div className="chart">
          <Charts />
        </div> */}
      </div>
    </>
  );
}
