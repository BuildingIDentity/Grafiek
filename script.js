const ctx = document.getElementById('chart').getContext('2d');
let chart;

const FRED_API_KEY = '2e36ea2956c8ea9b075070975eb33c66';
const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';
const CRYPTO_API = 'https://api.coingecko.com/api/v3/coins';

async function fetchFredData(seriesId) {
    const response = await fetch(`${FRED_BASE}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json`);
    const data = await response.json();
    return data.observations.map(obs => ({x: obs.date, y: parseFloat(obs.value)}));
}

async function fetchCryptoPrices(id) {
    const res = await fetch(`${CRYPTO_API}/${id}/market_chart?vs_currency=eur&days=365`);
    const json = await res.json();
    return json.prices.map(p => ({x: new Date(p[0]).toISOString().split('T')[0], y: p[1]}));
}

async function updateChart() {
    const indicatorEls = document.querySelectorAll('.indicator:checked');
    const cryptoEls = document.querySelectorAll('.crypto:checked');
    const datasets = [];

    for (let el of indicatorEls) {
        const data = await fetchFredData(el.value);
        datasets.push({
            label: `Econ. ${el.value}`,
            data,
            borderColor: getRandomColor(),
            yAxisID: 'y',
            tension: 0.3
        });
    }

    for (let el of cryptoEls) {
        const data = await fetchCryptoPrices(el.value);
        datasets.push({
            label: `Crypto ${el.value}`,
            data,
            borderColor: getRandomColor(),
            yAxisID: 'y1',
            tension: 0.3
        });
    }

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: { datasets },
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: { type: 'linear', position: 'left' },
                y1: { type: 'linear', position: 'right' }
            }
        }
    });
}

function getRandomColor() {
    return `rgb(${[1,2,3].map(() => Math.floor(Math.random()*255)).join(',')})`;
}

updateChart();
