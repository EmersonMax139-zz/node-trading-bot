const cron = require('node-cron');
const alpaca_api = require('./api/alpaca.js');
const polygon_api = require('./api/polygon.js');

async function price() {
    const response = await polygon_api.polygon.getStockPriceByTicker('MSFT');
    const price = response.last.price
    setTimeout(() => {
        console.log(price);
    }, 1000)
}

setInterval(async () => {
    const response = await polygon_api.polygon.getStockPriceByTicker('MSFT');
    const price = response.last.price
    setTimeout(() => {
        console.log(price);
    }, 1000);
}, 3000); 

// cron.schedule('*/1 * * * *', () => {
//     price();
// }) 



