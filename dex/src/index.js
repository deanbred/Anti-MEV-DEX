import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { walletConnectProvider } from "@web3modal/wagmi";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { mainnet, arbitrum, optimism, polygon } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { LedgerConnector } from "wagmi/connectors/ledger";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
//require("dotenv").config();

const chains = [mainnet, arbitrum, optimism, polygon];
const projectId = "fd8d18072056d2a74e2a5a29c946bb47";

const { publicClient } = configureChains(
  chains,
  [walletConnectProvider({ projectId })],
  [
    alchemyProvider({ apiKey: "TlfW-wkPo26fcc7FPw_3xwVQiPwAmI3T" }),
    publicProvider(),
  ]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({ options: { projectId, showQrModal: false } }),
    new InjectedConnector({ options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({ options: { appName: "Web3Modal" } }),
    new LedgerConnector({
      options: {
        projectId: "fd8d18072056d2a74e2a5a29c946bb47",
      },
    }),
  ],
  publicClient,
});

createWeb3Modal({ wagmiConfig, projectId, chains, themeMode: 'dark' })

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WagmiConfig>
  </React.StrictMode>
);
