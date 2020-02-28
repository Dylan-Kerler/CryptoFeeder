import { createStore } from "redux";
import socket from "../Socket";

const priceActions = {
    UPDATE_PRICE: "UPDATE_PRICE",
};

const priceReducer = (state, action) => {
    const newState = {...state}; //shallow copy is sufficient here
    switch (action.type) {
        case priceActions.UPDATE_PRICE:
            newState[action.data.pair] = parseFloat(action.data.price.toFixed(0));
            break;
        default:
            console.log("Invalid action type for priceReducer, got: ", action.type);
            break;
    }

    return newState;
};

const initialState = {};

const priceStore = createStore(priceReducer, initialState);
socket.on("NEW_BTC_PRICE", price => {
    console.log("asd");
    priceStore.dispatch({
        type: priceActions.UPDATE_PRICE,
        data: {
            pair: "BTCUSDT",
            price: parseFloat(price)
        }
    })
});

export default priceStore;
export { priceReducer };