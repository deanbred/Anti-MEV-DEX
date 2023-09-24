import "../styles/App.css";
import React, { useState, useEffect } from "react";
import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: "TlfW-wkPo26fcc7FPw_3xwVQiPwAmI3T",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

export default function TokenBalances(props) {
  const [balances, setBalances] = useState([]);
  const { address } = props;
  console.log(`address: ${address}`)

  useEffect(() => {
    async function fetchBalances() {
      const ethBalance = await alchemy.core.getBalance(
        "0x5F793b98817ae4609ad2C3c4D7171518E555ABA3"
      );
      console.log(ethBalance);

      const parsedEthBalance =
        parseInt(ethBalance.toString()) / Math.pow(10, 18);

      // create an object representing the Ethereum balance
      const ethBalanceObject = {
        name: "Ethereum",
        symbol: "ETH",
        logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        decimals: 18,
        balance: parsedEthBalance.toFixed(2),
        address: "0x",
      };

      const fetchedTokens = await alchemy.core.getTokenBalances(
        "0x5F793b98817ae4609ad2C3c4D7171518E555ABA3"
      );

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
    }

    fetchBalances();
  }, [address]);

  useEffect(() => {
    if (address) TokenBalances();
  }, [address]);

  return (
    <div className="">
      <h2>Token Balances</h2>
      <ul>
        {balances.map((token) => (
          <li key={token.address}>
            <img src={token.logo} height={24} alt={token.name} /> {token.name} (
            {token.symbol}): {token.balance}
          </li>
        ))}
      </ul>
    </div>
  );

/*   return (
    <div className={styles.token_panel_container}>
      <div className={styles.tokens_box}>
        {address?.length ? (
          <div className={styles.header}>
            {address?.slice(0, 6)}...
            {address?.slice(address.length - 4)}
          </div>
        ) : (
          ""
        )}

        {isLoading
          ? "Loading..."
          : tokensBalance?.length &&
            tokensBalance?.map((token, i) => {
              const convertedBalance = Math.round(token.balance * 100) / 100;
              return (
                <div key={i} className={styles.token_container}>
                  <div className={styles.token_name_logo}>
                    {token.logo ? (
                      <div className={styles.image_container}>
                        <img src={token.logo} alt={""}></img>
                      </div>
                    ) : (
                      <div className={styles.image_placeholder_container}></div>
                    )}
                    <div className={styles.coin_name}>
                      {token.name?.length > 15
                        ? token.name?.substring(0, 15)
                        : token.name}
                    </div>
                  </div>
                  <div className={styles.token_info}>
                    <div className={styles.price}>{convertedBalance}</div>
                    <div className={styles.coin_symbol}>{token.symbol}</div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  ); */

}

