import "../styles/App.css";
import React, { useState, useEffect } from "react";

export default function Balances(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [balances, setBalances] = useState([]);
  const { address, client, alchemy } = props;

  useEffect(() => {
    async function fetchBalances() {
      setIsLoading(true);
      const ethBalance = await alchemy.core.getBalance(address);

      const parsedEthBalance =
        parseInt(ethBalance.toString()) / Math.pow(10, 18);

      // create an object representing the Ethereum balance
      const ethBalanceObject = {
        name: "Ethereum",
        symbol: "ETH",
        logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        decimals: 18,
        balance: parsedEthBalance.toFixed(4),
        address: "0x",
      };

      // fetch the token balances for the address
      const fetchedTokens = await alchemy.core.getTokenBalances(address);
      console.log(fetchedTokens);

      const fetchedTokenBalances = fetchedTokens.tokenBalances.map(
        (token) => token.tokenBalance
      );

      const fetchedTokenAddresses = fetchedTokens.tokenBalances.map(
        (token) => token.contractAddress
      );

      // fetch the token metadata for each token address
      const fetchedTokenMetadata = await Promise.all(
        fetchedTokenAddresses.map(async (address) => {
          let metadata;
          try {
            metadata = await alchemy.core.getTokenMetadata(address);
          } catch (e) {
            console.log(e);
            metadata = {
              name: null,
              symbol: null,
              logo: null,
              decimals: null,
            };
          }

          return metadata;
        })
      );

      // create an array of objects representing each token balance
      const unifiedBalancedAndMetadata = [ethBalanceObject];

      for (let x = 0; x < fetchedTokenMetadata.length - 1; x++) {
        const tokenMetadata = fetchedTokenMetadata[x];
        const { name, symbol, logo, decimals } = tokenMetadata;
        const hexBalance = fetchedTokenBalances[x];
        const address = fetchedTokenAddresses[x];
        let convertedBalance;

        if (hexBalance && tokenMetadata.decimals) {
          convertedBalance = parseInt(hexBalance) / Math.pow(10, decimals);
          if (convertedBalance > 0) {
            const tokenBalanceAndMetadata = {
              name,
              symbol:
                symbol.length > 6 ? `${symbol.substring(0, 6)}...` : symbol,
              logo,
              decimals,
              balance: convertedBalance.toFixed(2),
              address,
            };
            unifiedBalancedAndMetadata.push(tokenBalanceAndMetadata);
          }
        }
      }

      // filter out any token balances with empty names
      unifiedBalancedAndMetadata.filter(
        (balanceAndMetadata) => balanceAndMetadata.name.length
      );

      setBalances(unifiedBalancedAndMetadata);
      setIsLoading(false);
    }

    fetchBalances();
  }, [address, alchemy.core, client]);

  return (
    <div className="token_panel_container">
      <div className="tokens_box">
        <h3 className="tokens_title">My Portfolio</h3>
        {address?.length ? (
          <div className="tokens_address">
            {address?.slice(0, 6)}...
            {address?.slice(address.length - 4)}
          </div>
        ) : (
          ""
        )}
        {isLoading
          ? "Loading..."
          : balances?.length &&
            balances?.map((token, i) => {
              const convertedBalance =
                Math.round(token.balance * 10000) / 10000;
              return (
                <div key={i} className="token_container">
                  <div className="token_name_logo">
                    {token.logo ? (
                      <div className="image_container">
                        <img src={token.logo} alt={""}></img>
                      </div>
                    ) : (
                      <div className="image_placeholder_container"></div>
                    )}
                    <div className="coin_name">
                      {token.name?.length > 15
                        ? token.name?.substring(0, 15)
                        : token.name}
                    </div>
                  </div>
                  <div className="token_info">
                    <div className="price">{convertedBalance}</div>
                    <div className="coin_symbol">{token.symbol}</div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
