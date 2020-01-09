const Binance = require('binance-api-node').default;
const client = Binance();
const {
    coinVolumes,
    coinSecondCache,
    coinPrices,
    recentEventCache,
    coinOrders,
    anomalyEmitter
} = require("./dataStore");
const {handleVolumeCandle} = require("./DataHandlers/volume");
const {handlePriceCandle} = require("./DataHandlers/price");

const subscribeToCandles = (basePair = "BTC", pairs, interval, callback) => {
    client.ws.candles(pairs, interval, candle => {
        console.log(candle);
        callback(candle, basePair);
    });
};

const subscribeToAggTrades = (basePair = "BTC", pairs = [], callback) => {
    client.ws.aggTrades(pairs, trade => {
        // check if the trade is anomalous (volume or price wise)
        const anomalies = callback(trade, basePair);
        anomalies.forEach(anomalyHandler);
    });
};

const subscribeToOrderBooks = (basePair = "BTC", pairs = [], callback) => {
    pairs = pairs.map(pair => ({symbol: pair, level: 20}));
    client.ws.partialDepth(pairs, orderBook => {
        // check if the order book is anomalous
        const anomalies = callback(orderBook, basePair);
        anomalies.forEach(anomalyHandler);
    });
};

const anomalyHandler = anomaly => {
    if (anomaly.isAnomaly) { //This is just a failsafe to check corrupted data
        console.log(`Found anomaly for ${anomaly.coin}: `);
        console.log(anomaly);

        //console.log(recentEventCache);
        recentEventCache[anomaly.group].push(anomaly);
        console.log(recentEventCache);
        anomalyEmitter.emit("NEW_ANOMALY", {anomaly});
        if (recentEventCache[anomaly.group].length > recentEventCache.limit) {
            recentEventCache[anomaly.group].shift();
        }
    }
};

const getPairs = async (basePair = "BTC") => {
    //Get all of the pairs that match the base pair
    const {symbols} = await client.exchangeInfo();
    const pairs = [];
    for (const pair of symbols) {
        if (pair.quoteAsset === basePair) {
            console.log(pair.baseAsset);
            pairs.push(pair.symbol);

            // Initialise the dataStores
            const coin = pair.symbol.replace(basePair, "");
            coinVolumes[coin] = {
                hourlyMa200: 0,
                hourly200Cache: [],
                seconds: [],
                totalSell: 0,
                lastUpdate: 0,
                totalBuy: 0
            };

            coinPrices[coin] = {
                hourlyMa200: 0, //volatility/range average
                hourly200Cache: [], //[candle range]
                dailyMa50: 0,
                dailyMa50Cache: [],
                seconds: [], //closes -- loop back and check highest - lowest at each range
                lastUpdate: 0,
            };

            coinSecondCache[coin] = {
                secondCache: [],
            };

            coinOrders[coin] = {
                lastCacheAdd: 0,
                lastUpdate: 0,
                orderBookCache60min: [],
                orderBookStates200: [],
            };
        }
    }

    console.log(`Set ${pairs.length} pair names!`)
    return {pairs, basePair};
};

const initialisePreviousCandles = async (limit, interval, pairs, basePair) => {
    // Run each request in parallel then wait on each promise in the array to resolve
    // Promise.all([promise1, promise2, promise3, ...])
    console.log(`Fetching previous candles for ${pairs.length} pairs...`);
    await Promise.all(pairs.map(async pair => {
        const candles = await client.candles({ symbol: pair, interval, limit });
        const coin = pair.replace(basePair, "");
        for (const candleIndex in candles) {
            const candle = candles[candleIndex];
            if (candleIndex % 24 === 0) { //candles are hourly so if 24 hours have passed we can take the close for daily
                coinPrices[coin].dailyMa50Cache.push(parseFloat(candle.close))
            }

            const volume = parseFloat(candle.volume) * parseFloat(candle.close);
            coinVolumes[coin].hourly200Cache.push(volume);

            const range = Math.abs(parseFloat(candle.high) - parseFloat(candle.low));
            coinPrices[coin].hourly200Cache.push(range);
        }

        //Initialise these ma values etc.
        const tmpCandle = candles[candles.length - 1];
        handlePriceCandle(tmpCandle, coin);
        handleVolumeCandle(tmpCandle, coin);
    }));

    console.log("Initialised previous candles!");
};

module.exports = {
    subscribeToCandles,
    subscribeToAggTrades,
    initialisePreviousCandles,
    getPairs,
    subscribeToOrderBooks
};