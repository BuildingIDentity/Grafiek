const ctx = document.getElementById('chart').getContext('2d');
let chart;

const FRED_API_KEY = '2e36ea2956c8ea9b075070975eb33c66';
const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';
const CRYPTO_API = 'https://api.coingecko.com/api/v3/coins';

// FRED data ophalen
async function fetchFredData(seriesId) {
    const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json`;
    const response = await fetch(url);
    const data = await response.json();
    return data.observations.map(obs => ({x: obs.date, y: parseFloat(obs.value)}));
}

// Crypto prijzen ophalen (laatste 365 dagen in EUR)
async function fetchCryptoPrices(cryptoId) {
    const response = await fetch(`${CRYPTO_API}/${cryptoId}/market_chart?vs_currency=eur&days=max`);
    const json = await response.json();
    return json.prices.map(p => ({x: new Date(p[0]).toISOString().split('T')[0], y: p[1]}));
}

// Grafiek genereren
async function updateChart() {
    const indicators = Array.from(document.querySelectorAll('.indicator:checked')).map(e => e.value);
    const cryptos = Array.from(document.querySelectorAll('.crypto:checked')).map(e => e.value);

    const datasets = [];

    // Indicatoren laden
    for (const ind of indicators) {
        const fredData = await
