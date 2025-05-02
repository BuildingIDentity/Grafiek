async function fetchData() {
  const chartElement = document.getElementById("chart").getContext("2d");

  // ✅ CoinGecko: BTC prijs (laatste 30 dagen)
  const btcRes = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30');
  const btcData = await btcRes.json();
  const btcPrices = btcData.prices.map(p => ({ x: new Date(p[0]), y: p[1] }));

  // ✅ FRED: BBP (let op je eigen API key)
  const fredRes = await fetch('https://api.stlouisfed.org/fred/series/observations?series_id=GDP&api_key=2e36ea2956c8ea9b075070975eb33c66&file_type=json');
  const fredData = await fredRes.json();
  const gdpData = fredData.observations
    .filter(obs => obs.value !== ".")
    .map(obs => ({ x: new Date(obs.date), y: parseFloat(obs.value) }));

  // Grafiek tekenen
  new Chart(chartElement, {
    type: "line",
    data: {
      datasets: [
        {
          label: "BTC/USD (30 dagen)",
          data: btcPrices,
          borderColor: "orange",
          yAxisID: "y1"
        },
        {
          label: "VS BBP (kwartaal)",
          data: gdpData,
          borderColor: "blue",
          yAxisID: "y2"
        }
      ]
    },
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
          title: { display: true, text: "BTC (USD)" }
        },
        y2: {
          type: "linear",
          position: "right",
          title: { display: true, text: "BBP (miljarden USD)" },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

fetchData();
