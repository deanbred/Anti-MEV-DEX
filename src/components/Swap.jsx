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
import Web3 from "web3";
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
import { Alchemy, Network, Utils } from "alchemy-sdk";

//import { exchangeProxy, devWallet, ZERO} from "../constants/constants.ts";

export default function Swap(props) {
  const { address, isConnected, client } = props;
  console.log(`address: ${address}`);
  console.log(`chainId:${client.chain.id} ${client.chain.name}`);
  const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  const alchemyKeys = {
    1: {
      apiKey: "TlfW-wkPo26fcc7FPw_3xwVQiPwAmI3T",
      network: Network.ETH_MAINNET,
    },
    42161: {
      apiKey: "aMlUHixH5lTM_ksIFZfJeTZm1N1nRVAO",
      network: Network.ARB_MAINNET,
    },
    10: {
      apiKey: "lymgKSMfxBS4I0YklOT_RnLT87MJm2we",
      network: Network.OPT_MAINNET,
    },
    5: {
      apiKey: "la9mAkNVUg51xj0AjxrGdIxSk1yBcpGg",
      network: Network.ETH_GOERLI,
    },
  };

  const alchemyConfig = alchemyKeys[client.chain.id];
  const alchemy = new Alchemy(alchemyConfig);
  console.log(`alchemyConfig: ${JSON.stringify(alchemyConfig)}`);

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
  console.log(`zeroxapi: ${zeroxapi}`);

  const filteredTokenList = tokenList.filter(
    (token) => token.chainId === client.chain.id
  );
  const [currentTokenList, setCurrentTokenList] = useState(filteredTokenList);
  //console.log(`currentTokenList: ${JSON.stringify(currentTokenList)}`);

  const [tokenOne, setTokenOne] = useState(tokenList[0]); // ETH
  console.log(`tokenOne: ${JSON.stringify(tokenOne)}`);

  const [tokenTwo, setTokenTwo] = useState(currentTokenList[1]);
  console.log(`tokenTwo: ${JSON.stringify(tokenTwo)}`);

  const [amounts, setAmounts] = useState({
    tokenOneAmount: null,
    tokenTwoAmount: null,
  });

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
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  const [price, setPrice] = useState(null);
  const [slippage, setSlippage] = useState(0.5);
  const [finalize, setFinalize] = useState(false);

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
    gas: txDetails?.gas,
    //allowanceTarget: txDetails?.allowanceTarget,
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
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      tokenOneAmount: e.target.value,
    }));
    console.log(`tokenOneAmount: ${amounts.tokenOneAmount}`);
    if (e.target.value && price) {
      setAmounts((prevAmounts) => ({
        ...prevAmounts,
        tokenTwoAmount: (e.target.value * price.ratio).toFixed(6),
      }));
      console.log(`tokenTwoAmount: ${amounts.tokenTwoAmount}`);
    } else {
      setAmounts((prevAmounts) => ({
        ...prevAmounts,
        tokenTwoAmount: null,
      }));
      console.log("NO PRICE DATA!");
    }
  }

  function switchTokens() {
    setPrice(null);
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      tokenOneAmount: null,
      tokenTwoAmount: null,
    }));
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
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      tokenOneAmount: null,
      tokenTwoAmount: null,
    }));
    if (changeToken === 1) {
      if (currentTokenList[i] !== tokenTwo) {
        setTokenOne(currentTokenList[i]);
        fetchPrices();
      } else {
        console.log("TokenOne and TokenTwo cannot be the same");
      }
    } else {
      if (currentTokenList[i] !== tokenOne) {
        setTokenTwo(currentTokenList[i]);
        fetchPrices();
      } else {
        console.log("TokenOne and TokenTwo cannot be the same");
      }
    }
    setIsOpen(false);
  }

  function setMax() {
    setAmounts({
      tokenOneAmount: balances.tokenOneBalance,
      tokenTwoAmount: (balances.tokenOneBalance * price.ratio).toFixed(6),
    });
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

      const amount = amounts.tokenOneAmount
        ? amounts.tokenOneAmount
        : "1.25";

      console.log(`amount: ${amount}`);

      const parsedAmount = Utils.parseUnits(amount, tokenOne.decimals).toString();
      console.log(`parsedAmount: ${parsedAmount}`);

      const headers = { "0x-api-key": "816edd7e-cce4-42e7-b70a-96ae48ee1768" };
      let params = {
        sellToken: tokenOne.address,
        buyToken: tokenTwo.address,
        sellAmount: parsedAmount,
        takerAddress: address,
      };

      const query = `${zeroxapi}/swap/v1/price?${qs.stringify(
        params
      )}, ${qs.stringify(headers)}`;

      console.log(`query: ${query}`);

      //const query2 = curl --location --request GET 'https://goerli.api.0x.org/swap/v1/price?buyToken=0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984&sellToken=0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6&sellAmount=100000&excludedSources=Kyber' --header '0x-api-key: 0ad3443e-19ec-4e03-bbdb-8c5492c4ad7d'

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

      const amount = amounts.tokenOneAmount
        ? amounts.tokenOneAmount
        : undefined;

      console.log(`amount: ${amount}`);

      const parsedAmount = Utils.parseUnits(amount, tokenOne.decimals).toString();
      console.log(`parsedAmount: ${parsedAmount}`);

      const headers = { "0x-api-key": "816edd7e-cce4-42e7-b70a-96ae48ee1768" };
      const params = {
        sellToken: tokenOne.address,
        buyToken: tokenTwo.address,
        sellAmount: parsedAmount,
        takerAddress: address,
        feeRecipient: "0xd577F7b3359862A4178667347F4415d5682B4E85", //dev
        buyTokenPercentageFee: 0.01,
        slippagePercentage: slippage / 100,
      };

      const query = `${zeroxapi}/swap/v1/quote  ?${qs.stringify(
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
      console.log("Executing Swap...");
      setIsSwapModalOpen(false);

      const web3 = new Web3(window.ethereum);
      console.log(web3);

      if (tokenOne.address !== ETH_ADDRESS) {
        const ERC20Contract = new web3.eth.Contract(erc20ABI, tokenOne.address);

        const allowance = await ERC20Contract.methods
          .allowance(tokenOne.address, address)
          .call();
        console.log(`allowance: `);

        if (allowance === "0n") {
          const approval = await ERC20Contract.methods
            .approve(
              txDetails.allowanceTarget,
              web3.utils.toWei("1000000000", "ether") // MaxUint256 equivalent in web3
            )
            .send({ from: address });

          console.log(`approval: ${JSON.stringify(approval)}`);
        }
      }

      finalize && setFinalize(true);
      sendTransaction && sendTransaction();
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
  }, [tokenOne, tokenTwo]);

  useEffect(() => {
    getBlock();
    const intervalId = setInterval(getBlock, 12500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (txDetails.to && finalize) {
      sendTransaction && sendTransaction();
    }
  }, [txDetails, finalize]);

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
        open={isSwapModalOpen}
        footer={null}
        onCancel={() => setIsSwapModalOpen(false)}
        title="Review Swap"
      >
        <div className="modalContent">
          <div className="assetReview">
            Send: {(txDetails.sellAmount / 10 ** tokenOne.decimals).toFixed(5)}
            <img
              src={tokenOne.logoURI}
              alt="assetOneLogo"
              className="assetLogo"
            />
            {tokenOne.symbol}
          </div>
          <div className="assetReview">
            Recieve:{" "}
            {(txDetails.buyAmount / 10 ** tokenTwo.decimals).toFixed(5)}
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
              {(txDetails.sellTokenToEthRate * 1).toFixed(5)}
            </li>
            <li>
              BuyTokenToEthRate: {(txDetails.buyTokenToEthRate * 1).toFixed(5)}
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
              id="inputOne"
              placeholder="0"
              value={amounts.tokenOneAmount}
              onChange={changeAmount}
              disabled={!isConnected}
            />
            <Input
              id="inputTwo"
              placeholder="0"
              value={amounts.tokenTwoAmount}
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
              {price && blockData.ethPrice && amounts.tokenOneAmount
                ? `Value: $${parseFloat(
                    amounts.tokenOneAmount *
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
                amounts.tokenOneAmount <= 0 ||
                balances.tokenOneBalance < amounts.tokenOneAmount
              }
              onClick={fetchQuote}
            >
              {balances.tokenOneBalance < amounts.tokenOneAmount
                ? "Insufficient Balance"
                : "Market Swap"}
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
