// maps are roughly 0.5 - 0.7 MB - so can be stored in RAM for quicker access and CPU performance
// hourlyMa: u32, seconds[1800; u32], secondCache[50; u32], totalSell: u32, totalBuy: u32
const EventEmitter = require('events');

/// ------ MAPS -------- ///
const coinVolumes = {}; // [coin: string]{hourlyMa: 0, seconds: [], totalSell: 0, totalBuy: 0}
const coinPrices = {};  // [coin: string]{dailyMa: 0, hourlyVolatilityMa: 0, seconds: [{close}], totalVolatility: 0}
const coinSecondCache = {}; //[coin: string] {secondCache: []}

const coinOrders = {};


/// This can be in redux
const recentEventCache = {
    limit: 600, // Cache the last 600 events
    "volume": [],
    "price": [],
    "liquidity": [],
};

class Emitter extends EventEmitter {}
const anomalyEmitter = new Emitter();

/*
setInterval(() => {
    console.log(
    `
    State of server:
        coinVolumes:    ${JSON.stringify(coinVolumes["ETH"])}
        coinPrices:     ${JSON.stringify(coinPrices["ETH"])}
        coinSecondCache:${JSON.stringify(coinSecondCache["ETH"])}
        coinOrders:     ${JSON.stringify(coinOrders["ETH"])}
        
        recentEventCache: ${JSON.stringify(recentEventCache)}
    `);
}, 30000);*/

module.exports = {
    anomalyEmitter,
    coinVolumes,
    coinPrices,
    coinOrders,
    coinSecondCache,
    recentEventCache
};