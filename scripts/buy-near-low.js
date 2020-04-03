const polygon_api = require('../api/polygon.js');
const alpaca_api = require('../api/alpaca.js');

const tickers = [
    "QQQ",
    "SPY",
    "AMD",
    "MSFT",
    "AAPL",
    "HUYA",
    "SPCE",
    "EMR",
    "NFLX"
]

let results = {}

async function getPrices() {
    tickers.forEach(async (ticker) => {
        const response = await polygon_api.polygon.getStockPriceByTicker(ticker);
        results[ticker] = response.last.price
    })
}

async function getTopGainers() {
    const response = await polygon_api.polygon.getTopGainers();
    console.log(response);
}

function imDumb() {
    getPrices();
    setTimeout(() => {
        console.log(results);
    }, 1000)
}

// imDumb();
getTopGainers();




