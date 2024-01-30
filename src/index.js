import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { walletConnectProvider } from "@web3modal/wagmi";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import {
  mainnet,
  arbitrum,
  arbitrumGoerli,
  sepolia,
  goerli,
} from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";

const chains = [
  mainnet,
  arbitrum,
  arbitrumGoerli,
  goerli,
  sepolia,
];

const projectId = "fd8d18072056d2a74e2a5a29c946bb47";

const { publicClient } = configureChains(
  chains,
  [walletConnectProvider({ projectId })],
  [alchemyProvider({ apiKey: "TlfW-wkPo26fcc7FPw_3xwVQiPwAmI3T" })]
);
console.log(`Public client: ${publicClient}`);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({ options: { projectId, showQrModal: false } }),
    new InjectedConnector({ options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({ options: { appName: "Web3Modal" } }),
  ],
  publicClient,
});

createWeb3Modal({ wagmiConfig, projectId, chains, themeMode: "dark" });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <WagmiConfig config={wagmiConfig}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </WagmiConfig>
);
