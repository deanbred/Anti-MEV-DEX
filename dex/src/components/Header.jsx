import React from "react";
import Logo from "../logo.png";
import { Link } from "react-router-dom";

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
          <w3m-network-button />
        </div>
        <div className="headerItem">
          <w3m-account-button />
        </div>
      </div>
    </header>
  );
}

export default Header;
