import React, {useState, useEffect} from "react";
import settingsStore, {settingsActions} from "./Store/Settings";

const Slider = (props) => {
    const [sliderValue, setSliderValue] = useState(props.defaultValue);

    const handleSliderChange = (event) => {
        setSliderValue(event.target.value);
    };

    // Initialise/Update the settings store every time sliderValue changes
    useEffect(() => {
        settingsStore.dispatch({type: props.setttingsType, data: sliderValue});
    }, [sliderValue]);

    const titleText = (() => {
        switch (props.dataType) {
            case "volume":
                return "Minimum volume";
            case "price":
                return "Minimum price increase";
            case "liquidity":
                return "Minimum order size";
            default:
                return `Error! Invalid datatype, got '${props.dataType}'`;
        }
    })();

    return (
        <div id={`min_${props.dataType}_slider_div`}>
            <h2>{titleText}: <b style={{color: "grey"}}>{sliderValue}</b></h2>
            <input type="range" min={"0"} max={props.max} step={props.step} id="test" onChange={handleSliderChange} value={sliderValue}/>
            <div>
                <strong className="min_value">{`${props.minText}`}</strong>
                <strong className="max_value">{`${props.maxText}`}</strong>
            </div>
        </div>
    )
};

const Sliders = () => {
    return (
        <React.Fragment>
            <Slider dataType={"volume"} setttingsType={settingsActions.UPDATE_MIN_VOLUME}
                    max={"1000000"} step={"1"}  minText={"$0"} maxText={"$5,000,000"} defaultValue={"50000"}/>
            <Slider dataType={"price"} setttingsType={settingsActions.UPDATE_MIN_PRICE_INCREASE}
                    max={"300"} step={"1"} minText={"0%"} maxText={"300%"} defaultValue={"5"}/>
            <Slider dataType={"liquidity"} setttingsType={settingsActions.UPDATE_MIN_ORDER_SIZE}
                    max={"3000000"} step={"1"} minText={"$0"} maxText={"$3,000,000"} defaultValue={"1500000"}/>
        </React.Fragment>

    )
};

export default Sliders;