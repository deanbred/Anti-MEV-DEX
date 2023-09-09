import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, arbitrum, optimism, avalanche } from "wagmi/chains";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { LedgerConnector } from "wagmi/connectors/ledger";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, arbitrum, optimism, avalanche],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_KEY }), publicProvider()]
);

const projectId = process.env.WALLETCONNECT_PROJECT_ID;

console.log(projectId);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "fd8d18072056d2a74e2a5a29c946bb47",
      },
    }),
    new LedgerConnector({
      chains,
      options: {
        projectId: "fd8d18072056d2a74e2a5a29c946bb47",
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: (detectedName) =>
          `Injected (${
            typeof detectedName === "string"
              ? detectedName
              : detectedName.join(", ")
          })`,
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WagmiConfig>
  </React.StrictMode>
);
