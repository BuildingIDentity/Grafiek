
const chartCtx = document.getElementById("chart").getContext("2d");
let chart;

function getRandomColor() {
  return `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`;
}

async function fetchFredData(seriesId) {
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=2e36ea2956c8ea9b075070975eb33c66&file_type=json`;
  const response = await fetch(url);
  const data = await response.json();
  return data.observations
    .filter(d => d.value !== '.')
    .map(d => ({ x: new Date(d.date), y: parseFloat(d.value) }));
}

async function fetchCryptoData(cryptoId) {
  const url = `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=30`;
  const response = await fetch(url);
  const data = await response.json();
  return data.prices.map(p => ({ x: new Date(p[0]), y: p[1] }));
}

async function updateChart() {
  const fredSelected = [...document.querySelectorAll(".indicator:checked")].map(el => el.value);
  const cryptoSelected = [...document.querySelectorAll(".crypto:checked")].map(el => el.value);

  const datasets = [];

  for (const id of fredSelected) {
    const data = await fetchFredData(id);
    datasets.push({
      label: `FRED: ${id}`,
      data,
      borderColor: getRandomColor(),
      yAxisID: "y"
    });
  }

  for (const id of cryptoSelected) {
    const data = await fetchCryptoData(id);
    datasets.push({
      label: `Crypto: ${id}`,
      data,
      borderColor: getRandomColor(),
      yAxisID: "y"
    });
  }

  if (chart) chart.destroy();

  chart = new Chart(chartCtx, {
    type: "line",
    data: { datasets },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: {
          type: "time",
          title: { display: true, text: "Datum" }
        },
        y: {
          type: "linear",
          position: "left",
          title: { display: true, text: "Waarde (USD / indicator)" }
        }
      }
    }
  });
}

updateChart(); // Laad standaard
