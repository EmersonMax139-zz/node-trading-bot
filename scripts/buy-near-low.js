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

let results = {};
let sanitized_data = [];

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

async function getAggregateData() {
    const response = await polygon_api.polygon.getAggregateData('MSFT', 1, '2020-03-02', '2020-04-02');

    sanitized_data.push({
        "ticker": response.ticker,
        "resultsCount": response.resultsCount
    })

    response.results.forEach(day => {
        sanitized_data.push({
            "volume": day.v,
            "high": day.h,
            "low": day.l
        })
    })
}

function imDumb() {
    getAggregateData();
    setTimeout(() => {
        console.log(sanitized_data);
    }, 1000)
}

imDumb();






