import React, { useEffect } from 'react';

function TradingViewWidget() {

  useEffect(() => {
    // Create script element
    const scriptEl = document.createElement('script');
    scriptEl.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    scriptEl.type = 'text/javascript';
    scriptEl.async = true;
    scriptEl.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
        { proName: "BYBIT:KASUSDT.P", title: "Kaspa" },
        { proName: "BYBIT:LINKUSDT.P", title: "Link" },
        { proName: "BYBIT:ARBUSDT.P", title: "Arbitrum" },
        { proName: "BYBIT:OPUSDT.P", title: "Optimism" },
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: false,
      displayMode: "adaptive",
      locale: "en",
    });

    // Append script element to container
    const containerEl = document.getElementById('tradingview-widget-container');
    if (containerEl) containerEl.appendChild(scriptEl);

    // Clean up on component unmount
    return () => {
      if (containerEl) containerEl.removeChild(scriptEl);
    };
  }, []);

  return (
    <div id="tradingview-widget-container" className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default TradingViewWidget;

