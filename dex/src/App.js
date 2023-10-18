import React from "react";
import "./styles/App.css";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";
import Limit from "./components/Limit";
import { Routes, Route } from "react-router-dom";
import { useAccount, usePublicClient } from "wagmi";

function App() {
  const { address, connector, isConnected } = useAccount();
  const publicClient = usePublicClient();

  return (
    <>
      <div className="App">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <Swap
                address={address}
                connector={connector}
                isConnected={isConnected}
                client={publicClient}
              />
            }
          />
          <Route
            path="/limit"
            element={
              <Limit
                address={address}
                connector={connector}
                isConnected={isConnected}
                client={publicClient}
              />
            }
          />
          <Route path="/tokens" element={<Tokens address={address} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
