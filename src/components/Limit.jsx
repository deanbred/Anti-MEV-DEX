/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message, Button } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
  SearchOutlined,
} from "@ant-design/icons";import { Link } from "react-router-dom";
import ConnectButton from "./Connect";
import Ticker from "./Ticker";
import Charts from "./Charts";
import bgImage from "../styles/circuit.jpg";
import { ethers } from "ethers";
import qs from "qs";

import {
  erc20ABI,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";

import { LimitOrder, OrderStatus, SignatureType } from "@0x/protocol-utils";
import { BigNumber, hexUtils } from "@0x/utils";

import tokenList from "../constants/tokenList.json";
import { Alchemy, Network, Utils } from "alchemy-sdk";

const exchangeProxy = "0xDef1C0ded9bec7F1a1670819833240f027b25EfF";
const devWallet = "0xd577F7b3359862A4178667347F4415d5682B4E85";
const MAX_ALLOWANCE = ethers.constants.MaxUint256;
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const NULL_BYTES = "0x";
const ZERO = new BigNumber(0);

export default function Limit(props) {
  const { address, connector, isConnected, client } = props;
  const [messageApi, contextHolder] = message.useMessage();

  //console.log(`address: ${address}`);
  //console.log(`isConnected: ${isConnected}`);
  //console.log(`chainId:${client.chain.id} ${client.chain.name}`);

  const alchemyKeys = {
    1: {
      apiKey: "TlfW-wkPo26fcc7FPw_3xwVQiPwAmI3T",
      network: Network.ETH_MAINNET,
    },
    42161: {
      apiKey: "aMlUHixH5lTM_ksIFZfJeTZm1N1nRVAO",
      network: Network.ARB_MAINNET,
    },
    5: {
      apiKey: "la9mAkNVUg51xj0AjxrGdIxSk1yBcpGg",
      network: Network.ETH_GOERLI,
    },
    421613: {
      apiKey: "PLaTiZe1BmgkCydWULIS2cxDoGISMWLK",
      network: Network.ARB_GOERLI,
    },
    420: {
      apiKey: "OdYJbCYLmfi8hAF9xABuWAbtOGNuDGeh",
      network: Network.OPT_GOERLI,
    },
  };

  const alchemyConfig = alchemyKeys[client.chain.id];
  const alchemy = new Alchemy(alchemyConfig);
  //console.log(`alchemyConfig: ${JSON.stringify(alchemyConfig)}`);

  const [zeroxapi, setZeroxapi] = useState("https://api.0x.org");
  //console.log(`zeroxapi: ${zeroxapi}`);

  const filteredTokenList = tokenList.filter(
    (token) => token.chainId === client.chain.id
  );
  const [currentTokenList, setCurrentTokenList] = useState(filteredTokenList);
  //console.log(`currentTokenList: ${JSON.stringify(currentTokenList)}`);

  const [tokenOne, setTokenOne] = useState(currentTokenList[1]); // ETH
  console.log(
    `tokenOne: ${tokenOne.name} : ${tokenOne.symbol} : ${tokenOne.address}`
  );

  const [tokenTwo, setTokenTwo] = useState(currentTokenList[2]);
  console.log(
    `tokenTwo: ${tokenTwo.name} : ${tokenTwo.symbol} : ${tokenTwo.address}`
  );

  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOneBalance, setTokenOneBalance] = useState(null);
  const [tokenTwoBalance, setTokenTwoBalance] = useState(null);
  const [changeToken, setChangeToken] = useState(1);

  const [isOpen, setIsOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [blockData, setBlockData] = useState({
    blockNumber: null,
    ethPrice: null,
  });
  const [ethBalance, setEthBalance] = useState("0.000");
  const [price, setPrice] = useState(null);
  const [slippage, setSlippage] = useState(0.5);
  const [finalize, setFinalize] = useState(false);

  const [limitPrice, setLimitPrice] = useState(null);

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
      if (parsedSlippage > 25) {
        alert("Slippage is high!");
        setSlippage(parsedSlippage);
      } else {
        setSlippage(parsedSlippage);
      }
      console.log(`slippage: ${parsedSlippage}`);
    }
  }

  function changeAmount(e) {
    setTokenOneAmount(e.target.value);
    if (e.target.value && price) {
      setTokenTwoAmount((e.target.value * price.ratio).toFixed(5));
      console.log(`tokenTwoAmount: ${tokenTwoAmount}`);
    } else {
      setTokenTwoAmount(null);
      console.log("NO PRICE DATA!");
    }
  }

  function changePrice(e) {
    setLimitPrice(e.target.value);
    if (e.target.value && tokenOneAmount) {
      setTokenTwoAmount((e.target.value * tokenOneAmount).toFixed(3));
    } else {
      setTokenTwoAmount(null);
    }
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
      setTokenOne(currentTokenList[i]);
      fetchPrices(currentTokenList[i], tokenTwo);
    } else {
      setTokenTwo(currentTokenList[i]);
      fetchPrices(tokenOne, currentTokenList[i]);
    }
    setIsOpen(false);
  }

  function setMax() {
    setTokenOneAmount(tokenOneBalance);
    setTokenTwoAmount((tokenOneBalance * price.ratio).toFixed(6));
  }

  async function getBlock() {
    try {
      const blockNumber = await alchemy.core.getBlockNumber();
      console.log(`BLOCK : ${blockNumber}`);

      const response = await fetch(
        "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=PCIG1T3NFQI4F4F5ZJ5W2B6RNAVZSGYZ9Q"
      );
      const data = await response.json();
      console.log(`ETH PRICE : ${parseFloat(data.result.ethusd).toFixed(5)}`);

      setBlockData({
        blockNumber: blockNumber,
        ethPrice: data.result.ethusd,
      });
    } catch (error) {
      console.error("Failed to get block data:", error);
    } finally {
    }
  }

  async function fetchBalances(one, two) {
    try {
      const ethBalance = await alchemy.core.getBalance(address);
      setEthBalance(ethBalance);
      console.log(
        `ETH BALANCE : ${Number(Utils.formatUnits(ethBalance, "ether")).toFixed(
          4
        )}`
      );

      let tokenAddress = [one.address];
      console.log(`tokenAddress from balances: ${tokenAddress}`);
      let data;

      if (one.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        setTokenOneBalance(
          Number(Utils.formatUnits(ethBalance, "ether")).toFixed(4)
        );
      } else {
        data = await alchemy.core.getTokenBalances(address, tokenAddress);

        data.tokenBalances.find((item) => {
          let balance = Number(
            Utils.formatUnits(item.tokenBalance, "ether")
          ).toFixed(4);
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
      }
      if (two.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        setTokenTwoBalance(
          Number(Utils.formatUnits(ethBalance, "ether")).toFixed(4)
        );
      } else {
        tokenAddress = [two.address];
        data = await alchemy.core.getTokenBalances(address, tokenAddress);

        data.tokenBalances.find((item) => {
          let balance = Number(
            Utils.formatUnits(item.tokenBalance, "ether")
          ).toFixed(4);
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
      }
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  }

  async function fetchPrices(one, two) {
    try {
      console.log("Fetching price...");

      const amount = tokenOneAmount ? tokenOneAmount : 10 * 10 ** 18;
      const headers = { "0x-api-key": "6b47fa57-3614-4aa2-bd99-a86e006b9d3f" };
      let params = {
        sellToken: one.address,
        buyToken: two.address,
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
      const headers = { "0x-api-key": "6b47fa57-3614-4aa2-bd99-a86e006b9d3f" };
      const params = {
        sellToken: tokenOne.address,
        buyToken: tokenTwo.address,
        sellAmount: amount.toString(),
        takerAddress: address,
        feeRecipient: "0xc2657176e213DDF18646eFce08F36D656aBE3396", //dev
        buyTokenPercentageFee: 0.01,
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
    setIsLimitModalOpen(true);
  }

  async function executeSwap() {
    try {
      setIsLimitModalOpen(false);

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

  async function createLimitOrder() {
    try {
      console.log("Creating Limit Order...");
      setIsLimitModalOpen(true);

      const expiration = new BigNumber(Date.now() + 600000)
        .div(1000)
        .integerValue(BigNumber.ROUND_CEIL);
      const pool = hexUtils.leftPad(1);

      // Create the order
      const limitOrder = new LimitOrder({
        chainId: client.chain.id,
        verifyingContract: exchangeProxy,
        maker: address,
        taker: NULL_ADDRESS,
        makerToken: tokenOne.address,
        takerToken: tokenTwo.address,
        makerAmount: tokenOneAmount,
        takerAmount: tokenTwoAmount,
        takerTokenFeeAmount: ZERO,
        sender: NULL_ADDRESS,
        feeRecipient: devWallet,
        expiry: expiration,
        pool,
        salt: new BigNumber(Date.now()),
      });
      console.log(`limitOrder: ${limitOrder}`);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (client.chain.id) {
      const filteredTokenList = tokenList.filter(
        (token) => token.chainId === client.chain.id
      );
      setCurrentTokenList(filteredTokenList);
      setTokenOne(currentTokenList[0]);
      setTokenTwo(currentTokenList[1]);

      if (client.chain.id === 1) {
        setZeroxapi("https://api.0x.org");
      } else if (client.chain.id === 42161) {
        setZeroxapi("https://arbitrum.api.0x.org/");
      } else if (client.chain.id === 10) {
        setZeroxapi("https://optimism.api.0x.org/");
      } else if (client.chain.id === 5) {
        setZeroxapi("https://goerli.api.0x.org/");
      }
    }
    console.log(`tokenList: ${JSON.stringify(currentTokenList)}`);
    fetchBalances(tokenOne, tokenTwo);
    fetchPrices(tokenOne, tokenTwo);
  }, [client.chain.id]);

  useEffect(() => {
    fetchBalances(tokenOne, tokenTwo);
    fetchPrices(tokenOne, tokenTwo);
  }, [tokenOne, tokenTwo]);

  useEffect(() => {
    getBlock();
    const intervalId = setInterval(getBlock, 12500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (txDetails.to && isConnected) {
      sendTransaction && sendTransaction();
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
      <input
        className="slippage"
        onChange={handleSlippageChange}
        placeholder="Enter value"
      />
      <Radio.Group value={slippage} onChange={handleSlippageChange}>
        <Radio.Button value={0.5}>0.5%</Radio.Button>
        <Radio.Button value={2.5}>2.5%</Radio.Button>
        <Radio.Button value={5}>5.0%</Radio.Button>
        <Radio.Button value={10}>10.0%</Radio.Button>
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

  async function handleTokenAddressInput(e) {
    let tokenMetadata;
    try {
      tokenMetadata = await alchemy.core.getTokenMetadata(e.target.value);

      const one = {
        name: tokenMetadata.name,
        address: e.target.value,
        symbol: tokenMetadata.symbol,
        decimals: tokenMetadata.decimals,
        chainId: client.chain.id,
        logoURI: tokenMetadata.logo,
      };
      setTokenOne(one);
    } catch (error) {
      console.error("Failed to fetch token metadata:", error);
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
        <div className="modalContent">
          {tokenList?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(i)}
              >
                <img src={e.logoURI} alt={e.symbol} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.symbol}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      <Modal
        open={isLimitModalOpen}
        footer={null}
        onCancel={() => setIsLimitModalOpen(false)}
        title="Limit Order"
      >
        <div className="modalContent">
          <div className="assetReview">
            Send: {(txDetails.sellAmount / 10 ** tokenOne.decimals).toFixed(3)}
            <img
              src={tokenOne.logoURI}
              alt="assetOneLogo"
              className="assetLogo"
            />
            {tokenOne.symbol}
          </div>
          <div className="assetReview">
            Recieve:{" "}
            {(txDetails.buyAmount / 10 ** tokenTwo.decimals).toFixed(3)}
            <img
              src={tokenTwo.logoURI}
              alt="assetOneLogo"
              className="assetLogo"
            />
            {tokenTwo.symbol}
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
          onClick={createLimitOrder}
        >
          Create Limit Order
        </div>
      </Modal>

      <div
        className="swap"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
        }}
      >
        <div className="ticker">
          <Ticker />
        </div>

        <div className="tradeBox">
          <div className="tradeBoxHeader">
            <div className="leftH">
              <Link to="/" className="link">
                <div className="headerItem opacity">Market</div>
              </Link>
              <Link to="/limit" className="link">
                <div className="">Limit</div>
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
              disabled={true}
            />
            <Input
              placeholder="0"
              value={limitPrice}
              onChange={changePrice}
              disabled={true}
            />

            <div className="assetOne" onClick={() => openModal(1)}>
              <img
                src={tokenOne.logoURI}
                alt="assetOneLogo"
                className="assetLogo"
              />
              {tokenOne.symbol}
              <DownOutlined />
            </div>

            <div className="balanceOne">Balance: {tokenOneBalance}</div>
            <div className="messageOne">Amount</div>

            <div className="valueOne">Value: $840.22</div>

            <Button className="maxButton" onClick={setMax}>
              MAX
            </Button>

            <div className="messageTwo">Limit Price</div>
          </div>

          <div className="convert">
            {price ? (
              <ul>
                <li>
                  1 {tokenOne.symbol} = {parseFloat(price.ratio).toFixed(3)}{" "}
                  {tokenTwo.symbol}
                </li>
                <li>Price Impact: {price.estimatedPriceImpact} %</li>
                <li>Protocol Fee: {price.protocolFee}</li>{" "}
                <li>
                  SellTokenToEthRate:
                  {(price.sellTokenToEthRate * 1).toFixed(3)}
                </li>
                <li>Estimated Gas: {price.estimatedGas} gwei</li>
              </ul>
            ) : (
              "Fetching Price..."
            )}
          </div>

          {isConnected ? (
            <button
              className="swapButton"
              disabled={!tokenOneAmount || !limitPrice}
              onClick={createLimitOrder}
            >
              Place Limit Order
            </button>
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

          <div className="block-container">
            <div>{price ? `Gas: ${price.estimatedGas} gwei` : ""}</div>

            {blockData && (
              <div>
                Block:{" "}
                <span style={{ color: "#089981" }}>
                  {blockData.blockNumber}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="chart">
          <Charts />
        </div>
      </div>
    </>
  );
}
