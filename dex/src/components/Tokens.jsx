import "../styles/App.css";
import React from "react";
import Heatmap from "./Heatmap.jsx";
import TokenBalances from "./TokenBalances.jsx";
import { useAccount } from "wagmi";

function Tokens() {
  const { address } = useAccount();

  return (
    <>
      <div className="tokens">
        <h3 className="tokenTitle">My Balances</h3>
        <TokenBalances address={address} />
        <div className="heatmap">
          <Heatmap />
        </div>
      </div>
    </>
  );
}

export default Tokens;
