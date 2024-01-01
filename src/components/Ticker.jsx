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
      symbols:  [
        {
          "proName": "FOREXCOM:SPXUSD",
          "title": "S&P 500"
        },
        {
          "proName": "BITSTAMP:BTCUSD",
          "title": "Bitcoin"
        },
        {
          "proName": "BITSTAMP:ETHUSD",
          "title": "Ethereum"
        },
        {
          "description": "",
          "proName": "COINBASE:SOLUSD"
        },
        {
          "description": "",
          "proName": "CRYPTO:AVAXUSD"
        },
        {
          "description": "",
          "proName": "BITSTAMP:INJUSD"
        },
        {
          "description": "",
          "proName": "KRAKEN:ARBUSD.PM"
        },
        {
          "description": "",
          "proName": "COINBASE:OPUSD"
        },
        {
          "description": "",
          "proName": "CRYPTO:KASUSD"
        },
        {
          "description": "",
          "proName": "BINANCE:RNDRUSD"
        },
        {
          "description": "",
          "proName": "COINBASE:SEIUSD"
        }
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
