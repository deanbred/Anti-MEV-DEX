import "../styles/App.css";
import React from "react";
import Heatmap from "./Heatmap.jsx";
import Balances from "./Balances.jsx";
import Market from "./Market";
import { useAccount } from "wagmi";

function Tokens() {
  const { address } = useAccount();

  return (
    <>
      <div className="tokens">
        <Balances address={address} />
        <div className="heatmap">
          <Heatmap />
        </div>
        <div className="market">
          <Market />
        </div>
      </div>
    </>
  );
}

export default Tokens;
