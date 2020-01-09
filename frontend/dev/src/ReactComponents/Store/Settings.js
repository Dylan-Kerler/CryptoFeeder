import { createStore } from "redux";

const settingsActions = {
    UPDATE_MIN_VOLUME: "UPDATE_MIN_VOLUME",
    UPDATE_MIN_PRICE_INCREASE: "UPDATE_MIN_PRICE_INCREASE",
    UPDATE_MIN_ORDER_SIZE: "UPDATE_MIN_ORDER_SIZE",
    UPDATE_COIN: "UPDATE_COIN",
};

const settingsReducer = (state, action) => {
    const newState = {...state}; // Cannot mutate the current state, must be a copy
    switch (action.type) {
        case settingsActions.UPDATE_MIN_VOLUME:
            newState.minVolume = action.data;
            break;
        case settingsActions.UPDATE_MIN_PRICE_INCREASE:
            newState.minPriceIncrease = action.data;
            break;
        case settingsActions.UPDATE_MIN_ORDER_SIZE:
            newState.minOrderSize = action.data;
            break;
        case settingsActions.UPDATE_COIN:
            newState.coin = action.coin;
            break;
        default:
            console.log("ERROR! '", action.type, "' is not an action");
            break;
    }

    return newState;
};

const initialState = {
    minVolume: 0,
    minPriceIncrease: 0,
    minOrderSize: 0,
    coin: "all"
};

const settingsStore = createStore(settingsReducer, initialState);

export default settingsStore;
export {settingsActions};