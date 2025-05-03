const ctx = document.getElementById('chart').getContext('2d');
let chart;

const FRED_API = 'https://api.stlouisfed.org/fred/series/observations';
const FRED_KEY = '2e36ea2956c8ea9b075070975eb33c66';

// Crypto in EUR
async function fetchCrypto(crypto) {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=eur&days=30`);
    const data = await res.json();
    return data.prices.map(p => ({x: new Date(p[0]), y: p[1]}));
}

// Economische indicatoren van FRED
async function fetchFred(series_id) {
    const res = await fetch(`${FRED_API}?series_id=${series_id}&api_key=${FRED_KEY}&file_type=json`);
    const data = await res.json();
    return data.observations.map(obs => ({
        x: new Date(obs.date),
        y: parseFloat(obs.value)
    })).filter(d => !isNaN(d.y));
}

async function updateChart() {
    const selectedIndicators = Array.from(document.querySelectorAll('.indicator:checked')).map(el => el.value);
    const selectedCryptos = Array.from(document.querySelectorAll('.crypto:checked')).map(el => el.value);

    const datasets = [];

    // Voeg indicatoren toe
    for (const indicator of selectedIndicators) {
        const data = await fetchFred(indicator);
        datasets.push({
            label: `FRED - ${indicator}`,
            data,
            borderColor: getRandomColor(),
            yAxisID: 'y'
        });
    }

    // Voeg crypto toe
    for (const crypto of selectedCryptos) {
        const data = await fetchCrypto(crypto);
        datasets.push({
            label: `Crypto - ${crypto}`,
            data,
            borderColor: getRandomColor(),
            yAxisID: 'y1'
        });
    }

    if(chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: { datasets },
        options: {
            responsive: true,
            interaction: { mode: 'nearest', axis: 'x', intersect: false },
            stacked: false,
            scales: {
                y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Economische Indicatoren' } },
                y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Crypto Prijs (€)' }, grid: { drawOnChartArea: false } }
            }
        }
    });
}

// Willekeurige kleuren
function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
}

// Eerste keer grafiek laden
updateChart();
