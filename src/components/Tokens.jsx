/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/App.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { erc20ABI } from "wagmi";

import { Input, message, Button } from "antd";
import { ArrowDownOutlined, DownOutlined } from "@ant-design/icons";
import ConnectButton from "./Connect";
import Balances from "./Balances.jsx";

import { Alchemy, Utils } from "alchemy-sdk";
import {
  alchemySetup,
  BURN_ADDRESS,
  DEPLOYER,
} from "../constants/constants.ts";

export default function Tokens(props) {
  const { address, isConnected, client } = props;

  const alchemyConfig = alchemySetup[client.chain.id];
  const alchemy = new Alchemy(alchemyConfig);

  const tokenOne = {
    address: "0x48b8039cF08E1D1524A68fC6d707D1D7e032e90C", // eth AntiMEV
    //address: "0x40f61395C4Dc6430909a08cF57001a2Ec0b24830",  // arb AntiMEV
    symbol: "AntiMEV",
    decimals: 18,
    logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  };

  const tokenTwo = {
    address: "0xDBbF2dFC3F8fb9DE18Aed9A935a73b39CAbA327B", // eth XMEV
    //address: "0xEC6dC6dF9E97FAf99f62aaD64934136bE8142735", // arb XMEV
    symbol: "XMEV",
    decimals: 18,
    logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  };

  console.log(`tokenTwo: ${tokenTwo.symbol}`);

  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);

  const [balances, setBalances] = useState({
    ethBalance: null,
    tokenOneBalance: null,
    tokenTwoBalance: null,
  });

  function setMax() {
    setTokenOneAmount(balances.tokenOneBalance);
    setTokenTwoAmount(balances.tokenOneBalance);
  }

  async function migrate() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const antiMEVContract = new ethers.Contract(
      tokenOne.address,
      erc20ABI,
      signer
    );

    const xmevContract = new ethers.Contract(
      tokenTwo.address,
      erc20ABI,
      signer
    );

    const approval = await antiMEVContract.approve(
      address,
      ethers.utils.parseUnits(tokenOneAmount.toString(), tokenOne.decimals)
    );
    await approval.wait();

    message.loading("Burning AntiMEV...", 5);
    const burn = await antiMEVContract.transferFrom(
      address,
      BURN_ADDRESS,
      ethers.utils.parseUnits(tokenOneAmount.toString(), tokenOne.decimals)
    );
    await burn.wait();

    message.loading("Claiming XMEV...", 5);
    const claim = await xmevContract.transferFrom(
      DEPLOYER,
      address,
      ethers.utils.parseUnits(tokenOneAmount.toString(), tokenOne.decimals)
    );
    await claim.wait();

    message.success("Migration complete!", 5);
    fetchBalances();
  }

  async function addToMM() {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: tokenTwo,
        },
      });
    } catch (error) {
      console.log(error);
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

      setBalances({
        ethBalance: Number(Utils.formatUnits(ethBalance, "ether")).toFixed(4),
        tokenOneBalance,
        tokenTwoBalance,
      });
    } catch (error) {
      console.log("Error fetching balances:", error);
    }
  }

  function changeAmount(e) {
    setTokenOneAmount(e.target.value);
    if (e.target.value) {
      setTokenTwoAmount(e.target.value);
    } else {
      setTokenTwoAmount(null);
    }
  }

  useEffect(() => {
    fetchBalances();
    setMax();
  }, [balances.tokenOneBalance, balances.tokenTwoBalance]);

  return (
    <>
      <div className="container">
        <div className="tradeBox">
          <div className="tradeBoxHeader">
            <div className="leftH">Token Migration</div>
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

            <div className="switchButton">
              <ArrowDownOutlined />
            </div>

            <div className="assetOne">
              <img
                src={tokenOne.logoURI}
                alt="assetOneLogo"
                className="assetLogo"
              />
              {tokenOne.symbol}
              <DownOutlined />
            </div>

            <Button className="maxButton2" onClick={setMax}>
              MAX
            </Button>
            <div className="messageOne">You send</div>
            <div className="balanceOne">
              Balance: {balances.tokenOneBalance}
            </div>

            <div className="assetTwo">
              <img
                src={tokenTwo.logoURI}
                alt="assetTwoLogo"
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

          {isConnected ? (
            <div
              className="swapButton"
              disabled={
                Number(tokenOneAmount) <= 0 ||
                Number(tokenOneAmount) > Number(balances.tokenOneBalance)
              }
              onClick={migrate}
            >
              Migrate
            </div>
          ) : (
            <ConnectButton />
          )}
          <div className="swapButton" onClick={addToMM}>
            Add XMEV to Metamask
          </div>
        </div>
      </div>

    </>
  );
}
