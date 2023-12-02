import "../styles/App.css";
import React from "react";
import Heatmap from "./Heatmap.jsx";
import Balances from "./Balances.jsx";
import Market from "./Market";
import { useAccount } from "wagmi";

export default function Tokens() {
  const { address } = useAccount();

  return (
    <>
      <div className="tokens">
        {address ? (
          <Balances address={address} />
        ) : (
          <div className="connect-wallet">
            Connect wallet to see token balances
          </div>
        )}
        <div className="heatmap">
          <Heatmap />
        </div>
        {/* <div className="market">
          <Market />
        </div> */}
      </div>
    </>
  );
}
