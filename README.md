# MEV Resistant Decentralized Exchange

0x API Goerli https://goerli.api.0x.org/

Goerli Sources: https://goerli.api.0x.org/swap/v1/sources.

### Liquidity sources on Goerli 
0x, MultiHop, SushiSwap, Uniswap, Uniswap_V2, Uniswap_V3

      //curl --location --request GET 'https://api.0x.org/swap/v1/quote?buyToken=DAI&sellToken=ETH&sellAmount=100000&excludedSources=Kyber' --header '0x-api-key: 0ad3443e-19ec-4e03-bbdb-8c5492c4ad7d'



## Test tokens available on Goerli
Recommended testing pair is WETH <> UNI deployed by Uniswap on Goerli.

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
