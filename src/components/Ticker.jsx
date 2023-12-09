import React, { useEffect, useRef } from "react";

export default function Ticker() {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
          proName: "FOREXCOM:SPXUSD",
          title: "S&P 500",
        },
        {
          proName: "FOREXCOM:NSXUSD",
          title: "US 100",
        },
        {
          proName: "BITSTAMP:BTCUSD",
          title: "Bitcoin",
        },
        {
          proName: "BITSTAMP:ETHUSD",
          title: "Ethereum",
        },
        {
          description: "Solana",
          proName: "BINANCE:SOLUSDT",
        },
        {
          description: "Avalanche",
          proName: "BINANCE:AVAXUSDT",
        },
        {
          description: "Chainlink",
          proName: "BINANCE:LINKUSD.P",
        },
        {
          description: "Tia",
          proName: "BINANCE:TIAUSDT.P",
        },
        {
          description: "Kaspa",
          proName: "BINANCE:KASUSDT.P",
        },
        {
          description: "Arbitrum",
          proName: "BINANCE:ARBUSDT.P",
        },
        {
          description: "Optimism",
          proName: "BINANCE:OPUSDT.P",
        },
      ],
      colorTheme: "dark",
      isTransparent: true,
      showSymbolLogo: true,
      locale: "en",
    });
    container.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}
