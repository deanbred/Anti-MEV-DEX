import "./App.css";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";
import { Routes, Route } from "react-router-dom";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
//import { useIsMounted } from "./components/useIsMounted";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

function App() {
  // connect wallet
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  // const { disconnect } = useDisconnect();

  return (
    <div className="App">
      <Header connect={connect} isConnected={isConnected} address={address} />

      <div className="mainWindow">
        <Routes>
          <Route
            path="/"
            element={<Swap isConnected={isConnected} address={address} />}
          />
          <Route path="/tokens" element={<Tokens />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
