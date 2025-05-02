async function updateChart() {
  const ctx = document.getElementById("chart").getContext("2d");
  const selected = Array.from(document.querySelectorAll(".indicator:checked")).map(cb => cb.value);

  const datasets = [];

  if (selected.includes("btc")) {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30");
    const data = await res.json();
    datasets.push({
      label: "Bitcoin (BTC)",
      data: data.prices.map(p => ({ x: new Date(p[0]), y: p[1] })),
      borderColor: getRandomColor(),
      yAxisID: "y"
    });
  }

  if (selected.includes("xrp")) {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/ripple/market_chart?vs_currency=usd&days=30");
    const data = await res.json();
    datasets.push({
      label: "XRP",
      data: data.prices.map(p => ({ x: new Date(p[0]), y: p[1] })),
      borderColor: getRandomColor(),
      yAxisID: "y"
    });
  }

  if (selected.includes("vechain")) {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/vechain/market_chart?vs_currency=usd&days=30");
    const data = await res.json();
    datasets.push({
      label: "VeChain",
      data: data.prices.map(p => ({ x: new Date(p[0]), y: p[1] })),
      borderColor: getRandomColor(),
      yAxisID: "y"
    });
  }

  if (selected.includes("blz")) {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/bluzelle/market_chart?vs_currency=usd&days=30");
    const data = await res.json();
    datasets.push({
      label: "Bluzelle (BLZ)",
      data: data.prices.map(p => ({ x: new Date(p[0]), y: p[1] })),
      borderColor: getRandomColor(),
      yAxisID: "y"
    });
  }

  if (selected.includes("inflation")) {
    const fred = await fetch("https://api.stlouisfed.org/fred/series/observations?series_id=FIE1T1&api_key=2e36ea2956c8ea9b075070975eb33c66&file_type=json");
    const json = await fred.json();
    const data = json.observations
      .filter(obs => obs.value !== ".")
      .map(obs => ({ x: new Date(obs.date), y: parseFloat(obs.value) }));

    datasets.push({
      label: "Forward Inflation Expectation Rate",
      data,
      borderColor: getRandomColor(),
      yAxisID: "y1"
    });
  }

  if (window.chart) window.chart.destroy();

  window.chart = new Chart(ctx, {
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
        y: {
          type: "linear",
          position: "left",
          title: { display: true, text: "Prijs (USD)" }
        },
        y1: {
          type: "linear",
          position: "right",
          title: { display: true, text: "Inflatie (%)" },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

function getRandomColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r}, ${g}, ${b})`;
}

updateChart();
