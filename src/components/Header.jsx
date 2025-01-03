import React from "react";
import Logo from "../icon.png";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <div className="leftH">
        <img className="logo" src={Logo} alt="logo" height={64} width={64} />
        <Link to="/" className="link">
          <div className="headerItem">Swap</div>
        </Link>
        <Link to="/xchain" className="link">
          <div className="headerItem">Cross-Chain</div>
        </Link>
        <Link to="/tokens" className="link">
          <div className="headerItem">Tokens</div>
        </Link>
      </div>
      <div className="rightH">
        <div className="networkButton">
          <w3m-network-button />
        </div>
        <div className="">
          <w3m-account-button />
        </div>
      </div>
    </header>
  );
}

export default Header;
