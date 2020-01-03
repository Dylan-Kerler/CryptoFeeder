const { subscribeToCandles, subscribeToAggTrades, getPairs, initialisePreviousCandles, subscribeToOrderBooks } = require("./backend/subcriptions");
const { updateSecondData, handleNewCandle, handleOrderBook } = require("./backend/DataHandlers/generic");
const { recentEventCache, anomalyEmitter } = require("./backend/dataStore");

getPairs("BTC").then(async ({pairs, basePair}) => {
    await initialisePreviousCandles(200, "1h", pairs, "BTC");
    subscribeToCandles(basePair, pairs, "1h", handleNewCandle);
    subscribeToAggTrades(basePair, pairs, updateSecondData);
    subscribeToOrderBooks(basePair, pairs, handleOrderBook);
});

const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const path = require("path");
const port = 3000;

const PORT = 3000;
http.listen(PORT, () => console.log("Server listening on port ", port));

app.get("/", (req, res) => {
    // noinspection JSUnresolvedVariable
    res.sendFile(path.join(__dirname, "/frontend/index.html"));
});

const spliceEventCache = (limit = 30, size = "LITTLE") => {
    /// Do a deep copy here (Object.assign and "..." spread operator only shallow copy)
    const sizedEventCache = JSON.parse(JSON.stringify(recentEventCache));
    Object.keys(sizedEventCache).forEach(key => {
        if (key !== "limit") {
            const length = sizedEventCache[key].length;
            // Only serve the 30 most recent elements for each anomaly type group
            if (length > limit) {
                size === "LITTLE"   ? sizedEventCache[key].splice(0, length - limit)
                : size === "BIG"    ? sizedEventCache[key].splice(length - limit, length)
                : process.exit(`Invalid 'size' type, expected 'LITTLE' or 'BIG', instead got: ${size}`);
            }
        }
    });

    return sizedEventCache;
};

app.use(express.static(path.join(__dirname, "frontend")));

/// Send the small cache first for better performance
app.get("/api/little_cache", (req, res) => {
    const littleEventCache = spliceEventCache(30, "LITTLE");
    res.json(littleEventCache);
});

/// Then send the bigger cache after the smaller cache
app.get("/api/big_cache", (req, res) => {
    const bigEventCache = spliceEventCache(30, "BIG");
    res.json(bigEventCache);
});

/// Websockets
io.on('connection', function(socket) {
    console.log('a user connected');
});

anomalyEmitter.on("NEW_ANOMALY", data => {
    console.log("emitted", data);
    io.emit("NEW_ANOMALY", data.anomaly);
});

