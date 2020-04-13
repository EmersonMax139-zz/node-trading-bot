const polygon_api = require('../api/polygon.js');
const alpaca_api = require('../api/alpaca.js');
const moment = require('moment');
const tickers = require('../watchlist.js');

// Initialize
const polygon = new polygon_api;

let results = {};
let sanitized_data = [];

async function getPrices() {
    tickers.forEach(async (ticker) => {
        const response = await polygon.getStockPriceByTicker(ticker);
        results[ticker] = response.last.price
    })
    console.log(results);
}

async function getAggregateData(ticker) {
    sanitized_data = [];

    const response = await polygon.getAggregateData(ticker, 1, '2020-03-02', moment().format('YYYY-MM-DD'));

    // Header for specific ticker
    sanitized_data.push({
        "ticker": response.ticker,
        "resultsCount": response.resultsCount
    })

    // Only pull certain values from data 
    response.results.forEach(day => {
        sanitized_data.push({
            "volume": day.v,
            "high": day.h,
            "low": day.l
        })
    })

    // Get lowest low over given period
    periodic_low = 0;
    for(let i = 0; i < sanitized_data.length; i++) {
        if(i !== 0) {
            if(i === 1) {
                periodic_low = sanitized_data[1].low; 
            } else {
                if(sanitized_data[i].low < periodic_low) {
                    periodic_low = sanitized_data[i].low;
                }
            }
        }
    }

    return {
        ticker,
        periodic_low
    }   
}

async function buy_near_low() {  
    // setInterval(() => {
    //     tickers.forEach(async (ticker) => {
    //         const response = await getAggregateData(ticker);
    //     })
    // }, 2000);

    // tickers.forEach(async ticker => {    
    //     const response = await getAggregateData(ticker);
    //     console.log(response);
    // })

    const r = await getAggregateData('MSFT');
    console.log(r)
 
}

buy_near_low();

module.exports = buy_near_low;






