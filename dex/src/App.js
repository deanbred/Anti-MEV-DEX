import "./styles/App.css";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";
import { Routes, Route } from "react-router-dom";
import { useAccount } from "wagmi";
import TradingViewWidget from "./components/TradingViewWidget";
//import { Helmet } from "react-helmet";

function App() {
  const { isConnected } = useAccount();
  const { address } = useAccount();

  return (
    <>
      <div className="App">
        <Header />

        {/*         <div className="mainWindow">
          <Helmet>
            <script
              type="text/javascript"
              src="https://files.coinmarketcap.com/static/widget/coinMarquee.js"
            ></script>
          </Helmet>
          <div
            id="coinmarketcap-widget-marquee"
            coins="1,1027,825"
            currency="USD"
            theme="light"
            transparent="false"
            show-symbol-logo="true"
          ></div>
        </div> */}

        <div className="mainWindow">
          <Routes>
            <Route
              path="/"
              element={<Swap isConnected={isConnected} address={address} />}
            />
            <Route path="/tokens" element={<Tokens />} />
          </Routes>
        </div>

        <div className="mainWindow">
          <TradingViewWidget />
        </div>
      </div>
    </>
  );
}

export default App;
