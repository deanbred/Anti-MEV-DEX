import BigNumber from "https://cdn.skypack.dev/bignumber.js";

const connectAndSwitchToGoerli = async () => {
  // Connect to wallet
  const accounts = await await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  // Switch to Goerli Testnet
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x5" }],
  });

  // For simplicity of the demo always pick the first account in that the user connected
  console.log(`Connected to account ${accounts[0]}`);
  return accounts[0];
};

const executeSwap = async (quote: any) => {
  const txParams = {
    ...quote,
    value: new BigNumber(quote.value).toString(16), // Convert value to hexadecimal
    gas: new BigNumber(quote.gas).toString(16), // Convert gas to hexadecimal
    gasPrice: new BigNumber(quote.gasPrice).toString(16), // Convert gasPrice to hexadecimal
  };

  // Execute trade directly with Metamask
  try {
    const txHash = await ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    // Show transaction result
    // Add link to Etherscan
    const etherscanLink = `https://goerli.etherscan.io/tx/${txHash}`;
    const a = document.createElement("a");
    a.href = etherscanLink;
    a.innerText = etherscanLink;
    a.target = "_blank";
    a.rel = "noreferrer noopener";
    document.body.prepend(a);
  } catch (err) {
    console.error(err);
    alert(err);
  }
};

const sellToken = "ETH";
const buyToken = "0xE68104D83e647b7c1C15a91a8D8aAD21a51B3B3E"; // DAI
const sellAmount = "100000000000000000"; // 0.1 ETH (18 decimals)
const headers = { "0x-api-key": "35aa607c-1e98-4404-ad87-4bed10a538ae" }; // This is a test API key. Get your own API key at https://dashboard.0x.org/

const btn = document.createElement("button");
const quoteDisplay = document.createElement("pre");
document.body.append(btn);
btn.innerText = "Click to connect Metamask 🦊";
btn.onclick = async () => {
  try {
    // Connect to Metamask and switch to Goerli
    const account = await connectAndSwitchToGoerli();

    // Fetch quote from Swap API
    const response = await fetch(
      `https://api.0x.org/swap/v1/quote?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}&takerAddress=${account}`,
      { headers }
    );
    const quote = await response.json();

    if (response.status !== 200) {
      // Something went wrong
      throw new Error(JSON.stringify(quote));
    }

    // Output show quote details
    console.log(quote);
    quoteDisplay.innerText = JSON.stringify(quote, undefined, 2);
    document.body.append(quoteDisplay);

    // Make button execute the swap
    btn.onclick = () => executeSwap(quote);
    btn.innerText = "Click to execute swap 0.1 Goerli ETH for Goerli DAI 💰";
  } catch (err) {
    console.error(err);
    alert(err);
  }
};
