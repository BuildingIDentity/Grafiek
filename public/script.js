const ctx = document.getElementById("chart").getContext("2d");
let chart;

function getRandomColor() {
  const r = Math.floor(Math.random()*200 + 20);
  const g = Math.floor(Math.random()*200 + 20);
  const b = Math.floor(Math.random()*200 + 20);
  return `rgb(${r},${g},${b})`;
}

async function fetchFredObs(seriesId) {
  const res = await fetch(`/fred/observations?id=${seriesId}`);
  const obs = await res.json();
  return obs
    .filter(o => o.value !== ".")
    .map(o => ({ x: new Date(o.date), y: parseFloat(o.value) }));
}

async function fetchCrypto(coinId) {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`);
  const data = await res.json();
  return data.prices.map(p => ({ x: new Date(p[0]), y: p[1] }));
}

async function updateChart() {
  const fredSelected = [...document.querySelectorAll(".fred:checked")].map(el=>el.value);
  const cryptoSelected = [...document.querySelectorAll(".crypto:checked")].map(el=>el.value);
  const datasets = [];

  // Voeg FRED-data toe
  for (let id of fredSelected) {
    const data = await fetchFredObs(id);
    datasets.push({
      label: `FRED: ${id}`,
      data,
      borderColor: getRandomColor(),
      yAxisID: "y1"
    });
  }

  // Voeg crypto-data toe
  for (let id of cryptoSelected) {
    const data = await fetchCrypto(id);
    datasets.push({
      label: `Crypto: ${id}`,
      data,
      borderColor: getRandomColor(),
      yAxisID: "y2"
    });
  }

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: { datasets },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: { type: "time", title: { display: true, text: "Datum" } },
        y1: { type: "linear", position: "left", title: { display: true, text: "FRED-waarde" } },
        y2: {
          type: "linear", position: "right",
          title: { display: true, text: "Crypto‐prijs (USD)" },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

// Initial render
updateChart();
