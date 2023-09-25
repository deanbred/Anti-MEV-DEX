import React, { useEffect, useRef } from "react";

export default function Market() {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      title: "Cryptocurrencies",
      title_raw: "Cryptocurrencies",
      title_link: "/markets/cryptocurrencies/prices-all/",
      width: "100%",
      height: "100%",
      locale: "en",
      showSymbolLogo: true,
      symbolsGroups: [
        {
          name: "Overview",
          symbols: [
            {
              name: "CRYPTOCAP:TOTAL",
            },
            {
              name: "BITSTAMP:BTCUSD",
            },
            {
              name: "BITSTAMP:ETHUSD",
            },
            {
              name: "FTX:SOLUSD",
            },
            {
              name: "BINANCE:AVAXUSD",
            },
            {
              name: "COINBASE:UNIUSD",
            },
          ],
        },
        {
          name: "Bitcoin",
          symbols: [
            {
              name: "BITSTAMP:BTCUSD",
            },
            {
              name: "COINBASE:BTCEUR",
            },
            {
              name: "COINBASE:BTCGBP",
            },
            {
              name: "BITFLYER:BTCJPY",
            },
            {
              name: "CME:BTC1!",
            },
          ],
        },
        {
          name: "Ethereum",
          symbols: [
            {
              name: "BITSTAMP:ETHUSD",
            },
            {
              name: "KRAKEN:ETHEUR",
            },
            {
              name: "COINBASE:ETHGBP",
            },
            {
              name: "BITFLYER:ETHJPY",
            },
            {
              name: "BINANCE:ETHBTC",
            },
            {
              name: "BINANCE:ETHUSDT",
            },
          ],
        },
        {
          name: "Solana",
          symbols: [
            {
              name: "FTX:SOLUSD",
            },
            {
              name: "BINANCE:SOLEUR",
            },
            {
              name: "COINBASE:SOLGBP",
            },
            {
              name: "BINANCE:SOLBTC",
            },
            {
              name: "HUOBI:SOLETH",
            },
            {
              name: "BINANCE:SOLUSDT",
            },
          ],
        },
        {
          name: "Uniswap",
          symbols: [
            {
              name: "COINBASE:UNIUSD",
            },
            {
              name: "KRAKEN:UNIEUR",
            },
            {
              name: "COINBASE:UNIGBP",
            },
            {
              name: "BINANCE:UNIBTC",
            },
            {
              name: "KRAKEN:UNIETH",
            },
            {
              name: "BINANCE:UNIUSDT",
            },
          ],
        },
      ],
      colorTheme: "dark",
    });
    container.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}
