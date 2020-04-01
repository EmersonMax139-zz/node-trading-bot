const fetch = require('node-fetch');
const Alpaca = require('@alpacahq/alpaca-trade-api');

const API_KEY = 'PK3KGE45SL8VTTNZHBVK';
const SECRET = 'rZWqrqdKki3Wj1Ax1fdUzHn09hmo5dy6E9vygA5k';

console.log("Starting Alpaca")

const alpaca = new Alpaca({
    keyId: API_KEY,
    secretKey: SECRET,
    paper: true,
})

// alpaca.getAccount().then((account) => {
//     console.log('Current Account:', account)
// })  

/* 
    1. Hit polygon api and get prices
    2. Open/close orders based off that
*/ 

let ticker = 'QQQ';
let price = '';


async function testShit() {
    await fetch(`https://api.polygon.io/v1/last/stocks/${ticker}?apiKey=PK3KGE45SL8VTTNZHBVK`, {
        method: "GET"
    }).then(response => response.json())
      .then(json => {
          price = json.last.price;
          console.log(price);
      })
      .catch(err => console.log(err))
}

const price_element = document.getElementById("price_display");
const ticker_element = document.getElementById("ticker_display");


async function main() {
    await testShit()
    ticker_element.innerHTML = ticker;
    price_element.innerHTML = price;
}
