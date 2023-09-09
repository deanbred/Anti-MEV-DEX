import React from "react";
import Logo from "../logo.png";
import { Link } from "react-router-dom";
import { Web3NetworkSwitch, Web3Button } from "@web3modal/react";

function Header() {
  return (
    <header>
      <div className="leftH">
        <img src={Logo} alt="logo" height={64} width={64} className="" />
        <Link to="/" className="link">
          <div className="headerItem">Swap</div>
        </Link>
        <Link to="/tokens" className="link">
          <div className="headerItem">Tokens</div>
        </Link>
      </div>
      <div className="rightH">
        <div className="headerItem">
          <Web3NetworkSwitch />
        </div>
        <div className="headerItem">
        <Web3Button icon="show" label="Connect Wallet" balance="show" />
        </div>
        <div className="headerItem">
        </div>
      </div>
    </header>
  );
}

export default Header;
