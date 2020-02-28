import React, { useEffect, useState } from "react";
import "./Button.css";

const Button = ({backgroundColor, textColor, text, style, onClick}) => {
    const BUTTON_STYLE = {
        backgroundColor,
        color: textColor,
        ...style
    };

    return (
        <div style={BUTTON_STYLE} className="button-default" onClick={onClick}>
            <span>
                {text}
            </span>
        </div>
    );
};

export default Button;