const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const app = express();
const API_KEY = "2e36ea2956c8ea9b075070975eb33c66";

// Static files (index.html + script.js)
app.use(express.static(path.join(__dirname, "public")));

// Proxy voor FRED series metadata (optioneel)
app.get("/fred/series", async (req, res) => {
  const id = req.query.id;
  const url = `https://api.stlouisfed.org/fred/series?series_id=${id}&api_key=${API_KEY}&file_type=json`;
  const fred = await fetch(url);
  const json = await fred.json();
  res.json(json.seriess[0] || {});
});

// Proxy voor FRED observations (de data)
app.get("/fred/observations", async (req, res) => {
  const id = req.query.id;
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${id}&api_key=${API_KEY}&file_type=json`;
  const fred = await fetch(url);
  const json = await fred.json();
  res.json(json.observations || []);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server draait op http://localhost:${PORT}`));
