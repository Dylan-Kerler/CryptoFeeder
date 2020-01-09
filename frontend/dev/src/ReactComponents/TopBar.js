import React, {useEffect, useState} from "react";
import settingsStore, {settingsActions} from "./Store/Settings";
import coins from "./config/coins";

const TopBar = () => {
    return (
        <React.Fragment>
            <SearchForCoin/>
        </React.Fragment>
    );
};

const SearchForCoin = () => {
    const [searchValue, setSearchValue] = useState("");
    const handleSearchChange = event => {
        setSearchValue(event.target.value);
    };

    const [predictions, setPredictions] = useState([]);
    useEffect(() => {
        setPredictions([]);
        const lowerCaseSearchValue = searchValue.toLowerCase();
        for (const coin of coins) {
            if ((coin.name.toLowerCase().startsWith(lowerCaseSearchValue)
                    || coin.symbol.toLowerCase().startsWith(lowerCaseSearchValue))
                        && searchValue !== "") {
                setPredictions(predictions => {
                    if (predictions.length < 5) { predictions.push(coin); }
                    return predictions;
                });
            }
        }
    }, [searchValue]);

    const predictionElements = predictions.map((prediction, index) =>
        <Prediction name={prediction.name} symbol={prediction.symbol} key={index}/>
    );

    const [predictionStyleWidth, setPredictionStyleWidth] = useState("0px");
    useEffect(() => { // on mount initialise the width of prediction div to be the same as the input search
        const width = document.getElementById("search_for_coin_input").getBoundingClientRect().width + "px";
        setPredictionStyleWidth(width);
    }, []);

    const predictionStyle = {
        width: predictionStyleWidth,
        position: "fixed",
        border: "1px solid #D8D8D8",
        borderRadius: "10px",
        textAlign: "left",
        zIndex: 20,
        overflow: "hidden",
        backgroundColor: "white"
    };

    const [showPredictions, setShowPredictions] = useState(false);
    const handlePredictionSelect = () => {
      setShowPredictions(false);
      setSearchValue("");
    };

    return (
        <React.Fragment>
            <div>
                <input id="search_for_coin_input" placeholder="Search for coin"
                       value={searchValue} onChange={handleSearchChange} onClick={() => setShowPredictions(true)}/>
                {
                    predictions.length > 0 && showPredictions &&
                        <div style={predictionStyle} onClick={handlePredictionSelect}>
                            {predictionElements}
                        </div>
                }
            </div>
        </React.Fragment>
    );
};

const Prediction = props => {
    const [isHover, setIsHover] = useState(true);

    const toggleHoverExit = () => {
        setIsHover(false);
    };

    const toggleHoverEnter = () => {
        setIsHover(true);
    };

    const handleSelect = () => {
        settingsStore.dispatch({
            type: settingsActions.UPDATE_COIN,
            coin: props.symbol
        });
    };

    const mouseOutClassName = isHover ? "" : "prediction_mouse_out";

    return (
        <div className={"search_prediction " + mouseOutClassName}
             onMouseEnter={toggleHoverEnter} onMouseLeave={toggleHoverExit}
             onClick={handleSelect}>
            {props.name} ({props.symbol})
        </div>
    )
};

export default TopBar;