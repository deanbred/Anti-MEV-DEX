import React from "react";
import TokensBalancePanel from "./TokenBalances.jsx";

function Tokens() {
  return (
    <div>
      Tokens
      <TokensBalancePanel
        walletAddress={"0x657D378e66B5E28143C88D85B116C053b8455509"}
        chain={"ETH_MAINNET"}
      />
    </div>
  );
}

export default Tokens;
