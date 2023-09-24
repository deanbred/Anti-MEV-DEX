import "./styles/App.css";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";
import { Routes, Route } from "react-router-dom";
import { useAccount } from "wagmi";

function App() {
  const { address, isConnected } = useAccount();

  return (
    <>
      <div className="App">
        <Header />
        <Routes>
          <Route
            path="/"
            element={<Swap isConnected={isConnected} address={address} />}
          />
          <Route
            path="/tokens"
            element={<Tokens address={address} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
