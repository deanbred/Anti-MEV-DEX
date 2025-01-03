/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message, Button } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
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

import tokenList from "../constants/tokenList.json";
import { Alchemy, Utils } from "alchemy-sdk";

import { LimitOrder, OrderStatus, SignatureType } from "@0x/protocol-utils";
import { BigNumber, hexUtils } from "@0x/utils";

import {
  exchangeProxy,
  devWallet,
  NULL_ADDRESS,
  ETH_ADDRESS,
  ZERO,
  alchemySetup,
  etherscan,
  headers,
} from "../constants/constants.ts";

export default function Limit(props) {
  const { address, isConnected, client } = props;

  const alchemyConfig = alchemySetup[client.chain.id];
  const alchemy = new Alchemy(alchemyConfig);

  let zeroxapi;
  if (client.chain.id === 1) {
    zeroxapi = "https://api.0x.org";
  } else if (client.chain.id === 42161) {
    zeroxapi = "https://arbitrum.api.0x.org/";
  } else if (client.chain.id === 10) {
    zeroxapi = "https://optimism.api.0x.org/";
  } else if (client.chain.id === 5) {
    zeroxapi = "https://goerli.api.0x.org/";
  }

  const filteredTokenList = tokenList.filter(
    (token) => token.chainId === client.chain.id
  );
  const [currentTokenList, setCurrentTokenList] = useState(filteredTokenList);
  //console.log(`currentTokenList: ${JSON.stringify(currentTokenList)}`);

  const [tokenOne, setTokenOne] = useState(tokenList[0]); // ETH
  console.log(`tokenOne: ${tokenOne.symbol}`);

  const [tokenTwo, setTokenTwo] = useState(currentTokenList[1]);
  console.log(`tokenTwo: ${tokenTwo.symbol}`);

  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);

  const [balances, setBalances] = useState({
    ethBalance: null,
    tokenOneBalance: null,
    tokenTwoBalance: null,
  });

  const [blockData, setBlockData] = useState({
    blockNumber: null,
    ethPrice: null,
  });

  const [changeToken, setChangeToken] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  const [isApproving, setIsApproving] = useState(false);
  const [price, setPrice] = useState(null);
  const [slippage, setSlippage] = useState(0.5);

  const [txDetails, setTxDetails] = useState({
    from: null,
    to: null,
    data: null,
    value: null,
    gas: null,
  });

  const { config } = usePrepareSendTransaction({
    from: txDetails?.from,
    to: txDetails?.to, // send call data to 0x Exchange Proxy
    data: txDetails?.data,
    value: txDetails?.value,
  });

  const { data, sendTransaction } = useSendTransaction(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const [messageApi, contextHolder] = message.useMessage();

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
      if (currentTokenList[i] !== tokenTwo) {
        setTokenOne(currentTokenList[i]);
      } else {
        console.log("TokenOne and TokenTwo cannot be the same");
      }
    } else {
      if (currentTokenList[i] !== tokenOne) {
        setTokenTwo(currentTokenList[i]);
      } else {
        console.log("TokenOne and TokenTwo cannot be the same");
      }
    }
    setIsOpen(false);
  }

  function setMax() {
    setTokenOneAmount(balances.tokenOneBalance);
    setTokenTwoAmount((balances.tokenOneBalance * price.ratio).toFixed(6));
  }

  async function getBlock() {
    try {
      const blockNumber = await alchemy.core.getBlockNumber();
      console.log(`BLOCK : ${blockNumber}`);

      const response = await fetch(etherscan);
      const data = await response.json();
      //console.log(`ETH PRICE : ${parseFloat(data.result.ethusd).toFixed(5)}`);

      setBlockData({
        blockNumber: blockNumber,
        ethPrice: data.result.ethusd,
      });
    } catch (error) {
      console.log("Failed to get block data:", error);
    } finally {
    }
  }

  async function fetchBalances() {
    try {
      const ethBalance = await alchemy.core.getBalance(address);
      console.log(
        `ETH BALANCE : ${Number(Utils.formatUnits(ethBalance, "ether")).toFixed(
          4
        )}`
      );

      let data, tokenAddress, tokenOneBalance, tokenTwoBalance;

      if (tokenOne.address === ETH_ADDRESS) {
        tokenOneBalance = Number(
          Utils.formatUnits(ethBalance, "ether")
        ).toFixed(4);
      } else {
        tokenAddress = [tokenOne.address];
        data = await alchemy.core.getTokenBalances(address, tokenAddress);

        data.tokenBalances.find((item) => {
          let balance = Number(
            Utils.formatUnits(item.tokenBalance, "ether")
          ).toFixed(4);
          if (
            item.tokenBalance ===
            "0x0000000000000000000000000000000000000000000000000000000000000000"
          ) {
            tokenOneBalance = "0.0000";
          } else {
            tokenOneBalance = balance;
          }
          return item.tokenBalance;
        });
      }

      if (tokenTwo.address === ETH_ADDRESS) {
        tokenTwoBalance = Number(
          Utils.formatUnits(ethBalance, "ether")
        ).toFixed(4);
      } else {
        tokenAddress = [tokenTwo.address];
        data = await alchemy.core.getTokenBalances(address, tokenAddress);

        data.tokenBalances.find((item) => {
          let balance = Number(
            Utils.formatUnits(item.tokenBalance, "ether")
          ).toFixed(4);
          if (
            item.tokenBalance ===
            "0x0000000000000000000000000000000000000000000000000000000000000000"
          ) {
            tokenTwoBalance = "0.0000";
          } else {
            tokenTwoBalance = balance;
          }
          return item.tokenBalance;
        });
      }

      setBalances({
        ethBalance: Number(Utils.formatUnits(ethBalance, "ether")).toFixed(4),
        tokenOneBalance,
        tokenTwoBalance,
      });
    } catch (error) {
      console.log("Error fetching balances:", error);
    }
  }

  async function fetchPrices() {
    try {
      console.log("Fetching price...");

      const amount = tokenOneAmount ? tokenOneAmount : "1.0";

      console.log(`amount: ${amount}`);

      const parsedAmount = Utils.parseUnits(
        amount,
        tokenOne.decimals
      ).toString();
      console.log(`parsedAmount: ${parsedAmount}`);

      let params = {
        sellToken: tokenOne.address,
        buyToken: tokenTwo.address,
        sellAmount: parsedAmount,
        takerAddress: address,
      };

      const query = `${zeroxapi}/swap/v1/price?${qs.stringify(params)}`;
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
      console.log("Error fetching price:", error);
    }
  }

  async function fetchQuote() {
    try {
      console.log("Fetching Quote...");

      const amount = tokenOneAmount ? tokenOneAmount : undefined;

      console.log(`amount: ${amount}`);

      const parsedAmount = Utils.parseUnits(
        amount,
        tokenOne.decimals
      ).toString();
      console.log(`parsedAmount: ${parsedAmount}`);

      const params = {
        sellToken: tokenOne.address,
        buyToken: tokenTwo.address,
        sellAmount: parsedAmount,
        //takerAddress: address,
        feeRecipient: devWallet,
        buyTokenPercentageFee: 0.01,
        slippagePercentage: slippage / 100,
        exludeSources: "Kyber",
      };

      const query = `${zeroxapi}/swap/v1/quote?${qs.stringify(params)}`;
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

  async function createLimitOrder() {
    try {
      console.log("Creating Limit Order...");
      setIsLimitModalOpen(false);

      const expiration = new BigNumber(Date.now() + 600000)
        .div(1000)
        .integerValue(BigNumber.ROUND_CEIL);
      const _pool = hexUtils.leftPad(1);

      // Create the order
      const order = new LimitOrder({
        chainId: 1,
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
        pool: _pool,
        salt: new BigNumber(Date.now()),
      });

      console.log(`limitOrder: ${JSON.stringify(order)}`);

      const supportedProvider = new ethers.providers.Web3Provider(
        window.ethereum
      );
      const signer = supportedProvider.getSigner();

      const signature = await order.getSignatureWithProviderAsync(
        supportedProvider,
        SignatureType.EIP712,
        signer
      );

      console.log(`Signature: ${JSON.stringify(signature, undefined, 2)}`);

      const signedOrder = { ...order, signature };

      const resp = await fetch("https://api.0x.org/v1/order", {
        method: "POST",
        body: JSON.stringify(signedOrder),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.status === 200) {
        alert("Successfully posted order");
      } else {
        const body = await resp.json();
        alert(
          `ERROR(status code ${resp.status}): ${JSON.stringify(
            body,
            undefined,
            2
          )}`
        );
      }
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
      setTokenOne(tokenList[0]);
      setTokenTwo(currentTokenList[1]);
    }
    console.log(`tokenList: ${JSON.stringify(currentTokenList)}`);
  }, [client.chain.id]);

  useEffect(() => {
    fetchPrices();
  }, [tokenOne, tokenTwo]);

  useEffect(() => {
    fetchBalances();
  }, [tokenOne, tokenTwo, isSuccess]);

  useEffect(() => {
    getBlock();
    const intervalId = setInterval(getBlock, 12500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    messageApi.destroy();

    if (isLoading || isApproving) {
      messageApi.open({
        type: "loading",
        content: "Transaction is Pending...",
        duration: 0,
      });
    }
  }, [isLoading, isApproving]);

  useEffect(() => {
    messageApi.destroy();
    if (isSuccess) {
      messageApi.open({
        type: "success",
        content: "Transaction Successful",
        duration: 2.0,
      });
    } else if (txDetails.to) {
      messageApi.open({
        type: "error",
        content: "Transaction Failed",
        duration: 2.0,
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
        title="Select Token"
      >
        <div className="modalContent">
          <Input
            className="tokenAddressInput"
            type="text"
            placeholder="Paste address"
            onChange={(e) => handleTokenAddressInput(e)}
          />

          <div className="tokenOne" onClick={() => setIsOpen(false)}>
            <img
              src={tokenOne.logoURI}
              alt={tokenOne.symbol}
              className="tokenLogo"
            />
            <div className="tokenChoiceNames">
              <div className="tokenName">{tokenOne.name}</div>
              <div className="tokenTicker">{tokenOne.symbol}</div>
            </div>
          </div>

          {currentTokenList?.map((e, i) => {
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
                <div className="headerItem">Limit</div>
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
              id="inputOne"
              placeholder="0"
              value={tokenOneAmount}
              onChange={changeAmount}
              disabled={!isConnected}
            />
            <Input
              id="inputTwo"
              placeholder="0"
              value={tokenTwoAmount}
              disabled={true}
            />

            <div className="switchButton" onClick={switchTokens}>
              <ArrowDownOutlined />
            </div>

            <div className="assetOne" onClick={() => openModal(1)}>
              <img
                src={tokenOne.logoURI}
                alt="assetOneLogo"
                className="assetLogo"
              />
              {tokenOne.symbol}
              <DownOutlined />
            </div>

            <Button className="maxButton" onClick={setMax}>
              MAX
            </Button>
            <div className="messageOne">You send</div>
            <div className="balanceOne">
              Balance: {balances.tokenOneBalance}
            </div>

            <div className="valueOne">
              {price && blockData.ethPrice && tokenOneAmount
                ? `Value: $${parseFloat(
                    tokenOneAmount *
                      (blockData.ethPrice / price.sellTokenToEthRate)
                  ).toFixed(2)}`
                : ""}
            </div>

            <div className="assetTwo" onClick={() => openModal(2)}>
              <img
                src={tokenTwo.logoURI}
                alt="assetOneLogo"
                className="assetLogo"
              />
              {tokenTwo.symbol}
              <DownOutlined />
            </div>

            <div className="messageTwo">You receive</div>
            <div className="balanceTwo">
              Balance: {balances.tokenTwoBalance}
            </div>
          </div>

          <div className="price-container">
            <div className="">
              {price
                ? `1 ${tokenOne.symbol} = ${parseFloat(price.ratio).toFixed(
                    3
                  )} ${tokenTwo.symbol}`
                : "Fetching..."}
            </div>
            <div className="">
              {blockData
                ? `($${parseFloat(blockData.ethPrice).toFixed(2)})`
                : "($)"}
            </div>
          </div>

          {isConnected ? (
            <div
              className="swapButton"
              disabled={
                true
                //Number(tokenOneAmount) <= 0 ||
                // Number(balances.tokenOneBalance) < Number(tokenOneAmount)
              }
              onClick={fetchQuote}
            >
              Create Order
            </div>
          ) : (
            <ConnectButton />
          )}

          <Popover
            title="Swap Details and Liquidity Sources"
            content={renderJsonObject(price)}
            trigger="click"
            placement="bottom"
          >
            <button className="swapButton">Show Aggregator</button>
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

        <div className="chart">{<Charts />}</div>
      </div>
    </>
  );
}
