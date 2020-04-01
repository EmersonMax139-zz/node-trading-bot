const fetch = require('node-fetch');

const API_KEY = 'PK3KGE45SL8VTTNZHBVK';
const SECRET = 'rZWqrqdKki3Wj1Ax1fdUzHn09hmo5dy6E9vygA5k';

let ticker = 'MNK';

// Hit polygon jawn
const getStockPriceByTicker = async (ticker) => {
    fetch(`https://api.polygon.io/v1/last/stocks/${ticker}?apiKey=PK3KGE45SL8VTTNZHBVK`, {
        method: "GET"
    })
    .then(response => response.json())
    .then(json => {
        price = json.last.price;
        console.log(price);
    })
    .catch(err => {
        console.error(err);
    })    
}
