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
        <div className="tokens_panel_container">
          <TokenBalances walletAddress={address} />
        </div>
        <div className="heatmap">
          <Heatmap />
        </div>
      </div>
    </>
  );
}

export default Tokens;
