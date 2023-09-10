const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/tokenPrice", async (req, res) => {
  const { query } = req;

  const responseOne = await Moralis.EvmApi.token.getTokenPrice({
    include: "percent_change",
    //exchange: "uniswapv2",
    address: query.addressOne,
  });

  const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
    include: "percent_change",
    //exchange: "uniswapv2",
    address: query.addressTwo,
  });

  const usdPrices = {
    tokenOne: responseOne.raw.usdPrice,
    tokenTwo: responseTwo.raw.usdPrice,
    ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice,
  };

  /*   const response = await Moralis.EvmApi.marketData.getTopERC20TokensByMarketCap(
    {}
  ); */

  return res.status(200).json(usdPrices);
});

Moralis.start({
  apiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjViZjAyNzlmLTM4YmQtNDU1NC1iMmUzLTk5MjI5MjY5YjZhNyIsIm9yZ0lkIjoiMzI4MzIyIiwidXNlcklkIjoiMzM3NTU5IiwidHlwZUlkIjoiYTRkMWE3ZTktNmQwMS00ZjRmLWE0ODctN2JjZTM0MDNjMDgxIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTM4MTI2MTAsImV4cCI6NDg0OTU3MjYxMH0.93-12EoZNHE8muucuOd60rEZB7BeP9EQCkwuNrkrT0w",
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
