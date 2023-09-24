import React from "react";
import TokensBalancePanel from "./TokenBalances.jsx";
import Heatmap from "./Heatmap.jsx";

function Tokens() {
  return (
    <>
      <div className="">
        <TokensBalancePanel
          walletAddress={"0x5F793b98817ae4609ad2C3c4D7171518E555ABA3"}
          chain={"ETH_MAINNET"}
        />
        <Heatmap />
      </div>
    </>
  );
}

export default Tokens;
