/* import { SquidWidget } from "@0xsquid/widget";

export default <SquidWidget
  config={{
    integratorId: "squid-swap-widget",
    companyName: "XMEV",
    style: {
      neutralContent: "#959BB2",
      baseContent: "#E8ECF2",
      base100: "#10151B",
      base200: "#272D3D",
      base300: "#171D2B",
      error: "#ED6A5E",
      warning: "#FFB155",
      success: "#2EAEB0",
      primary: "#71B4BD",
      secondary: "#71B4BD",
      secondaryContent: "#191C29",
      neutral: "#191C29",
      roundedBtn: "5px",
      roundedCornerBtn: "999px",
      roundedBox: "5px",
      roundedDropDown: "7px",
    },
    slippage: 1.5,
    infiniteApproval: false,
    enableExpress: true,
    apiUrl: "https://api.squidrouter.com",
    comingSoonChainIds: [],
    titles: {
      swap: "Swap",
      settings: "Settings",
      wallets: "Wallets",
      tokens: "Select Token",
      chains: "Select Chain",
      history: "History",
      transaction: "Transaction",
      allTokens: "Select Token",
      destination: "Destination address",
    },
    priceImpactWarnings: {
      warning: 3,
      critical: 5,
    },
    showOnRampLink: true,
    preferDex: [""],
  }}
/>; */
import Ticker from "./Ticker";

export default () => (
  <div className="swap">
    <div className="ticker">
      <Ticker />
    </div>
    <iframe
      title="squid_widget"
      width="420"
      height="685"
      src="https://widget.squidrouter.com/iframe?config=%7B%22integratorId%22%3A%22xmev-swap-widget%22%2C%22companyName%22%3A%22XMEV%22%2C%22style%22%3A%7B%22neutralContent%22%3A%22%23959BB2%22%2C%22baseContent%22%3A%22%23E8ECF2%22%2C%22base100%22%3A%22%2310151B%22%2C%22base200%22%3A%22%23272D3D%22%2C%22base300%22%3A%22%23171D2B%22%2C%22error%22%3A%22%23ED6A5E%22%2C%22warning%22%3A%22%23FFB155%22%2C%22success%22%3A%22%232EAEB0%22%2C%22primary%22%3A%22%2371B4BD%22%2C%22secondary%22%3A%22%2371B4BD%22%2C%22secondaryContent%22%3A%22%23191C29%22%2C%22neutral%22%3A%22%23191C29%22%2C%22roundedBtn%22%3A%225px%22%2C%22roundedCornerBtn%22%3A%22999px%22%2C%22roundedBox%22%3A%225px%22%2C%22roundedDropDown%22%3A%227px%22%7D%2C%22slippage%22%3A1.5%2C%22infiniteApproval%22%3Afalse%2C%22enableExpress%22%3Atrue%2C%22apiUrl%22%3A%22https%3A%2F%2Fapi.squidrouter.com%22%2C%22comingSoonChainIds%22%3A%5B%5D%2C%22titles%22%3A%7B%22swap%22%3A%22Cross-Chain Swap%22%2C%22settings%22%3A%22Settings%22%2C%22wallets%22%3A%22Wallets%22%2C%22tokens%22%3A%22Select%20Token%22%2C%22chains%22%3A%22Select%20Chain%22%2C%22history%22%3A%22History%22%2C%22transaction%22%3A%22Transaction%22%2C%22allTokens%22%3A%22Select%20Token%22%2C%22destination%22%3A%22Destination%20address%22%7D%2C%22priceImpactWarnings%22%3A%7B%22warning%22%3A3%2C%22critical%22%3A5%7D%2C%22showOnRampLink%22%3Atrue%7D"
    />
  </div>
);
