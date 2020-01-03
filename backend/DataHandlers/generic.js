const { checkVolumeSeconds, handleVolumeCandle } = require("./volume");
const { checkPriceSeconds, handlePriceCandle } = require("./price");
const { handleBookUpdate } = require("./liquidity");
const { isNewSecond } = require("../utils");
const {
    coinSecondCache,
} = require("../dataStore");

/// Updates second volume data, and checks for anomalies
/// Returns an array of anomalies (empty if none are found)
const updateSecondData = (mostRecentTrade, basePair = "BTC") => {
    const coin = mostRecentTrade.symbol.replace(basePair, ""); // Just get the stock pair and ignore base
    let anomalies = [];
    // If the most recent trade is more than a second after the 2nd most recent trade
    if (isNewSecond(mostRecentTrade, coin)) {
        const volumeAnomalies = checkVolumeSeconds(coin, mostRecentTrade); //returns false if no anomaly is found
        const priceAnomalies = checkPriceSeconds(coin, mostRecentTrade);

        coinSecondCache[coin].secondCache = []; // Clear the current second cache
        coinSecondCache[coin].secondCache.push(mostRecentTrade);
        anomalies = [...volumeAnomalies, ...priceAnomalies];
    }

    coinSecondCache[coin].secondCache.push(mostRecentTrade);
    return anomalies;
};

const handleNewCandle = (candle, basePair = "BTC") => {
    if (candle.isFinal) { // only on candle completion
        const coin = candle.symbol.replace(basePair, "");
        handleVolumeCandle(candle, coin);
        handlePriceCandle(candle, coin);
    }
};

const handleOrderBook = (orderBook, basePair = "BTC") => {
    const coin = orderBook.symbol.replace(basePair, "");
    const anomalies = handleBookUpdate(orderBook, coin);
    return anomalies;
};

module.exports = {
    updateSecondData,
    handleNewCandle,
    handleOrderBook
};