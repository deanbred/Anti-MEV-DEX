/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/App.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { erc20ABI } from "wagmi";

import { Input, Modal, message, Button } from "antd";
import { ArrowDownOutlined, DownOutlined } from "@ant-design/icons";
import ConnectButton from "./Connect";
import Balances from "./Balances.jsx";
import Market from "./Market";

import { Alchemy, Utils } from "alchemy-sdk";
import { alchemySetup, BURN_ADDRESS } from "../constants/constants.ts";

export default function Tokens(props) {
  const { address, isConnected, client } = props;

  const alchemyConfig = alchemySetup[client.chain.id];
  const alchemy = new Alchemy(alchemyConfig);

  const tokenOne = {
    //address: "0x48b8039cF08E1D1524A68fC6d707D1D7e032e90C", // mainnet AntiMEV
    address: "0x0BC0F6b6B642b75c3cbe0eDFC0a378a1E3da2dc4", // sepolia AntiMEV
    symbol: "AntiMEV",
    decimals: 18,
    logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  };

  const tokenTwo = {
    address: "0xE1f909c59bd03261b3bE2e4d2cceBa5dC54F4AFe", // sepolia XMEV
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

  // Token Migrate function burns AntiMEV and mints XMEV
  // approve AntiMEV to be burned
  // send AntiMEV to burn address
  // mint XMEV to user address

  async function migrate(amount) {
    // Step 1: Approve AntiMEV to be burned
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider);

    const signer = provider.getSigner();
    console.log(signer);
    
    const antiMEVContract = new ethers.Contract(tokenOne.address, erc20ABI, signer);
    const approvalTx = await antiMEVContract.approve(BURN_ADDRESS, ethers.utils.parseUnits(amount.toString(), tokenOne.decimals));
    await approvalTx.wait();
   
    // Step 2: Send AntiMEV to burn address
    const burnTx = await antiMEVContract.transferFrom(signer.getAddress(), BURN_ADDRESS, ethers.utils.parseUnits(amount.toString(), tokenOne.decimals));
    await burnTx.wait();
   
    // Step 3: Mint XMEV to user address
    const xmevContract = new ethers.Contract(tokenTwo.address, erc20ABI, signer);
    const mintTx = await xmevContract.mint(signer.getAddress(), ethers.utils.parseUnits(amount.toString(), tokenTwo.decimals));
    await mintTx.wait();
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
  }, []);

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
                !tokenOneAmount ||
                Number(tokenOneAmount) <= 0 ||
                Number(balances.tokenOneBalance) < Number(tokenOneAmount)
              }
              onClick={fetchBalances}
            >
              Migrate
            </div>
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
      <div className="container">
        {address ? (
          <Balances address={address} />
        ) : (
          <div className="connect-wallet">
            Connect wallet to see token balances
          </div>
        )}
        <div className="market">
          <Market />
        </div>
      </div>
    </>
  );
}
