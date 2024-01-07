const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());
require("dotenv").config();
const port = 3001;

app.post("/api", async (req, res) => {
  const { param1, param2 } = req.body;
  const response = await axios.get("https://api.example.com/data", {
    params: {
      param1,
      param2,
    },
    headers: {
      "X-API-KEY": process.env.API_KEY,
    },
  });
  res.send(response.data);
});

app.listen(port, () => console.log("Server running on port 3000"));
