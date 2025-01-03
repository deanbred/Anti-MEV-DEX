# MEV Resistant Decentralized Exchange

0x API Goerli https://goerli.api.0x.org/

Goerli Sources: https://goerli.api.0x.org/swap/v1/sources.

  // Switch to Goerli Testnet
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x5" }],
  });

  const executeSwap = async (quote: any) => {
  const txParams = {
    ...quote,
    value: new BigNumber(quote.value).toString(16), // Convert value to hexadecimal
    gas: new BigNumber(quote.gas).toString(16), // Convert gas to hexadecimal
    gasPrice: new BigNumber(quote.gasPrice).toString(16), // Convert gasPrice to hexadecimal
  };

 Add 
  // Execute trade directly with Metamask
  try {
    const txHash = await window.ethereum.request({
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

  /*   async function fetchOneInch() {
    const allowance = await axios.get(
      `https://api.1inch.io/v5.0/1/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`
    );

    if (allowance.data.allowance === "0") {
      const approve = await axios.get(
        `https://api.1inch.io/v5.0/1/approve/transaction?tokenAddress=${tokenOne.address}`
      );

      setTxDetails(approve.data);
      console.log("not approved");
      return;
    }

    const tx = await axios.get(
      `https://api.1inch.io/v5.0/1/swap?fromTokenAddress=${
        tokenOne.address
      }&toTokenAddress=${tokenTwo.address}&amount=${tokenOneAmount.padEnd(
        tokenOne.decimals + tokenOneAmount.length,
        "0"
      )}&fromAddress=${address}&slippage=${slippage}`
    );

    let decimals = Number(`1E${tokenTwo.decimals}`);
    setTokenTwoAmount((Number(tx.data.toTokenAmount) / decimals).toFixed(3));

    setTxDetails(tx.data.tx);
  } */

### Liquidity sources on Goerli 
0x, MultiHop, SushiSwap, Uniswap, Uniswap_V2, Uniswap_V3

      //curl --location --request GET 'https://goerli.api.0x.org/swap/v1/quote?buyToken=0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984&sellToken=0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6&sellAmount=100000&excludedSources=Kyber' --header '0x-api-key: 0ad3443e-19ec-4e03-bbdb-8c5492c4ad7d'

       const quote = await axiosInstance.get(`${zeroxapi}/swap/v1/quote`, {
        params: params,
        headers: headers,
      });
      const { data, to, value, gas, gasPrice } = swapResponse.data;

## Price: WETH <> UNI
curl --location --request GET 'https://goerli.api.0x.org/swap/v1/price?buyToken=0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984&sellToken=0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6&sellAmount=100000&excludedSources=Kyber' --header '0x-api-key: 0ad3443e-19ec-4e03-bbdb-8c5492c4ad7d'     


## Quote: Sell WETH, Buy UNI
curl --location --request GET 'https://goerli.api.0x.org/swap/v1/quote?buyToken=0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984&sellToken=0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6&sellAmount=100000&excludedSources=Kyber' --header '0x-api-key: 0ad3443e-19ec-4e03-bbdb-8c5492c4ad7d'

## Quote: Sell UNI, Buy WETH
curl --location --request GET 'https://goerli.api.0x.org/swap/v1/quote?buyToken=0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6&sellToken=0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984&sellAmount=100000&excludedSources=Kyber' --header '0x-api-key: 0ad3443e-19ec-4e03-bbdb-8c5492c4ad7d'

## Quote: Sell UNI, Buy ETH
curl --location --request GET 'https://goerli.api.0x.org/swap/v1/quote?buyToken=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&sellToken=0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984&sellAmount=100000&excludedSources=Kyber' --header '0x-api-key: 0ad3443e-19ec-4e03-bbdb-8c5492c4ad7d'

## Quote: Sell ETH, Buy UNI
curl --location --request GET 'https://goerli.api.0x.org/swap/v1/quote?buyToken=0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984&sellToken=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&sellAmount=100000&excludedSources=Kyber' --header '0x-api-key: 0ad3443e-19ec-4e03-bbdb-8c5492c4ad7d'

## Test tokens available on Goerli
Recommended testing pair is WETH <> UNI deployed by Uniswap on Goerli.

## ETH: 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee

### UNI: `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984`
### WETH: `0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6`

### DAI: `0xE68104D83e647b7c1C15a91a8D8aAD21a51B3B3E`
### USDC: `0x5FfbaC75EFc9547FBc822166feD19B05Cd5890bb`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


approval: {"hash":"0x7c143669d80d2a419ebabbe6799219b858b6f65e2b24610ea408092dd2565cb0","type":2,"accessList":null,"blockHash":null,"blockNumber":null,"transactionIndex":null,"confirmations":0,"from":"0x5F793b98817ae4609ad2C3c4D7171518E555ABA3","gasPrice":{"type":"BigNumber","hex":"0x09b889fe1a"},"maxPriorityFeePerGas":{"type":"BigNumber","hex":"0x05f5e100"},"maxFeePerGas":{"type":"BigNumber","hex":"0x09b889fe1a"},"gasLimit":{"type":"BigNumber","hex":"0x679f"},"to":"0x514910771AF9Ca656af840dff83E8264EcF986CA","value":{"type":"BigNumber","hex":"0x00"},"nonce":333,"data":"0x095ea7b3000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff00000000000000000000000000000000000000000000000006f05b59d3b20000","r":"0x21b4dced380ad010b01aa0da5eadc14b99e7012878c96497ca6415eeaf2c9a2a","s":"0x40a4bfd09cd1605838eb8609d5822df00c7850c6be742bed7e42d33d898af265","v":0,"creates":null,"chainId":0}
Swap.jsx:293 txParams: {"from":"0x5F793b98817ae4609ad2C3c4D7171518E555ABA3","to":"0xdef1c0ded9bec7f1a1670819833240f027b25eff","data":"0x415565b00000000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f9840000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000000000000000000000000000056bc75e2d63100000000000000000000000000000000000000000000000000016d22f217178f5fc0100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000004400000000000000000000000000000000000000000000000000000000000000540000000000000000000000000000000000000000000000000000000000000002100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000380000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f9840000000000000000000000006b175474e89094c44da98b954eedeac495271d0f00000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000340000000000000000000000000000000000000000000000000000000000000034000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000056bc75e2d63100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000012556e69737761705633000000000000000000000000000000000000000000000000000000000000056bc75e2d63100000000000000000000000000000000000000000000000000016daf5e644c6921b88000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000e592427a0aece92de3edee1f18e0157c058615640000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000421f9840a85d5af5bf1d1762f925bdaddc4201f984000bb82260fac5e5542a773aa44fbcfedf7c193bc2c599000bb86b175474e89094c44da98b954eedeac495271d0f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000006b175474e89094c44da98b954eedeac495271d0f00000000000000000000000000000000000000000000000008c6c4d34d9c1f87000000000000000000000000ad01c20d5886137e056775af56915de824c8fce5000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f984000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000033e0c25e65a77f1fdee0f8e1021faebe55f842ff00000000000000000000000000000000bcf64ca16fc4815b8b2bf7d6212219ca","value":"0","chainId":1,"price":"4.252323783402221457","guaranteedPrice":"4.209737304647248107","estimatedPriceImpact":"0","gas":null,"estimatedGas":"181570","gasPrice":"33500000000","protocolFee":"0","minimumProtocolFee":"0","buyTokenAddress":"0x6b175474e89094c44da98b954eedeac495271d0f","sellTokenAddress":"0x1f9840a85d5af5bf1d1762f925bdaddc4201f984","buyAmount":"425232378340222145753","sellAmount":"100000000000000000000","sources":[{"name":"0x","proportion":"0"},{"name":"Uniswap","proportion":"0"},{"name":"Uniswap_V2","proportion":"0"},{"name":"Curve","proportion":"0"},{"name":"Balancer","proportion":"0"},{"name":"Balancer_V2","proportion":"0"},{"name":"BancorV3","proportion":"0"},{"name":"SushiSwap","proportion":"0"},{"name":"DODO","proportion":"0"},{"name":"DODO_V2","proportion":"0"},{"name":"CryptoCom","proportion":"0"},{"name":"Lido","proportion":"0"},{"name":"MakerPsm","proportion":"0"},{"name":"KyberDMM","proportion":"0"},{"name":"Uniswap_V3","proportion":"1"},{"name":"Curve_V2","proportion":"0"},{"name":"ShibaSwap","proportion":"0"},{"name":"Synapse","proportion":"0"},{"name":"Synthetix","proportion":"0"},{"name":"Aave_V2","proportion":"0"},{"name":"Compound","proportion":"0"},{"name":"KyberElastic","proportion":"0"},{"name":"Maverick_V1","proportion":"0"}],"orders":[{"type":0,"source":"Uniswap_V3","makerToken":"0x6b175474e89094c44da98b954eedeac495271d0f","takerToken":"0x1f9840a85d5af5bf1d1762f925bdaddc4201f984","makerAmount":"425864787549733500000","takerAmount":"100000000000000000000","fillData":{"router":"0xe592427a0aece92de3edee1f18e0157c05861564","path":"0x1f9840a85d5af5bf1d1762f925bdaddc4201f984000bb82260fac5e5542a773aa44fbcfedf7c193bc2c599000bb86b175474e89094c44da98b954eedeac495271d0f","gasUsed":20285,"routerVersion":1},"fill":{"input":"100000000000000000000","output":"425864787549733500000","adjustedOutput":"418366236557352335603","gas":140522}}],"allowanceTarget":"0xdef1c0ded9bec7f1a1670819833240f027b25eff","decodedUniqueId":"0xbcf64ca16fc4815b8b2bf7d6212219ca","sellTokenToEthRate":"375.46095033472726058","buyTokenToEthRate":"1592.89892725803903372","fees":{"zeroExFee":{"feeType":"volume","feeToken":"0x6b175474e89094c44da98b954eedeac495271d0f","feeAmount":"632409209511354247","billingType":"on-chain"}},"grossPrice":"4.258647875497335","grossBuyAmount":"425864787549733500000","grossSellAmount":"100000000000000000000","auxiliaryChainData":{},"expectedSlippage":null}