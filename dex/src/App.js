import "./styles/App.css";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";
import { Routes, Route } from "react-router-dom";
import { useAccount } from "wagmi";
import TradingViewWidget from "./components/TradingViewWidget";
import TickerWidget from "./components/TickerWidget";

function App() {
  const { address, isConnected } = useAccount();

  return (
    <>
      <div className="App">
        <Header />
        <TickerWidget />
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
