const {
    coinSecondCache,
} = require("./dataStore");

const calcMa = series => {
    let total = 0;
    for (const item of series) {
        total += item;
    }
    return total / series.length;
};

const isNewSecond = (mostRecentTrade, coin) => {
    const coinSecondCacheInfo = coinSecondCache[coin];
    if (coinSecondCacheInfo.secondCache.length <= 0) { return false; } // If the second cache has not yet been initialised

    const currSecond = Math.floor(mostRecentTrade.eventTime / 1000);
    const lastTradeInCache = coinSecondCacheInfo.secondCache[coinSecondCacheInfo.secondCache.length - 1];
    const lastCachedSecondTime = Math.floor(lastTradeInCache.eventTime / 1000);

    return (currSecond !== lastCachedSecondTime);
};

module.exports = {
    calcMa,
    isNewSecond
};