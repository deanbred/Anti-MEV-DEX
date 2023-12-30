import React from "react";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";
import Limit from "./components/Limit";
import { Routes, Route } from "react-router-dom";
import { useAccount, usePublicClient } from "wagmi";
import "./styles/App.css";

function App() {
  const { address, isConnected } = useAccount();
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
