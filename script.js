// context van de canvas
const ctx = document.getElementById("chart").getContext("2d");
let chart;

// CORS-proxy zodat FRED-aanroepen niet geblokkeerd worden
const FRED_PROXY = "https://api.allorigins.win/raw?url=";
const FRED_BASE  = "https://api.stlouisfed.org/fred/series/observations";
const API_KEY    = "2e36ea2956c8ea9b075070975eb33c66";

// Genereer een willekeurige kleur
function getRandomColor() {
  const r = Math.floor(Math.random()*200+20),
        g = Math.floor(Math.random()*200+20),
        b = Math.floor(Math.random()*200+20);
  return `rgb(${r},${g},${b})`;
}

// FRED data ophalen via proxy
async function fetchFredObs(seriesId) {
  const url = `${FRED_PROXY}${encodeURIComponent(
    `${FRED_BASE}?series_id=${seriesId}&api_key=${API_KEY}&file_type=json`
  )}`;
  const res  = await fetch(url);
  const json = await res.json();
  return json.observations
    .filter(o => o.value !== ".")
    .map(o => ({ x: new Date(o.date), y: parseFloat(o.value) }));
}

// Crypto data ophalen van CoinGecko
async function fetchCrypto(coin) {
  const url  = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=30`;
  const res  = await fetch(url);
  const json = await res.json();
  return json.prices.map(p => ({ x: new Date(p[0]), y: p[1] }));
}

// Bouw en render de grafiek
async function updateChart() {
  // geselecteerde FRED-series
  const fredSel   = [...document.querySelectorAll(".fred:checked")].map(el=>el.value);
  // geselecteerde crypto-coins
  const cryptoSel = [...document.querySelectorAll(".crypto:checked")].map(el=>el.value);
  const datasets  = [];

  // Voeg elk FRED-dataset toe
  for (let id of fredSel) {
    const data = await fetchFredObs(id);
    datasets.push({
      label: `FRED – ${id}`,
      data,
      borderColor: getRandomColor(),
      yAxisID: "y1"
    });
  }

  // Voeg elk crypto-dataset toe
  for (let coin of cryptoSel) {
    const data = await fetchCrypto(coin);
    datasets.push({
      label: `Crypto – ${coin}`,
      data,
      borderColor: getRandomColor(),
      yAxisID: "y2"
    });
  }

  // Vernieuw chart
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "line",
    data: { datasets },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: {
          type: "time",
          time: { unit: "day" },
          title: { display: true, text: "Datum" }
        },
        y1: {
          type: "linear",
          position: "left",
          title: { display: true, text: "FRED-waarde" }
        },
        y2: {
          type: "linear",
          position: "right",
          title: { display: true, text: "Crypto-prijs (USD)" },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

// Initial render
updateChart();
