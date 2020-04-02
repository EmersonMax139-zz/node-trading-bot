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

function checkPriceDiff() {
    tickers.forEach((ticker) => {
        let current_price = 0;

        // Get price
        current_price = polygon_api.getStockPriceByTicker(ticker);
        console.log(`${ticker}: $${current_price}`)

        // Get 52 week low
        low_price =  

    })
}