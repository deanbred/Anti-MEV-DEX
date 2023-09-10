import React from "react";
import TokensBalancePanel from "./TokenBalances.jsx";

function Tokens() {
  return (
    <div>
      Tokens
      <TokensBalancePanel
        walletAddress={"deanbred.eth"}
        chain={"ETH_MAINNET"}
      />
    </div>
  );
}

export default Tokens;
