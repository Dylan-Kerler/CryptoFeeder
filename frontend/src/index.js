import React from 'react';
import ReactDOM from 'react-dom';
import "./css/data.css";
import "./css/generic.css";
import "./css/header.css";
import "./css/main.css";
import "./css/slider.css";
import "./css/topBar.css";

import Header from "./ReactComponents/Header";
import TopBar from "./ReactComponents/TopBar/TopBar";
import Sliders from "./ReactComponents/Sliders";
import DataDisplay from "./ReactComponents/DataDisplay/DataDisplay";

ReactDOM.render(<Header/>, document.getElementById("header_div"));
ReactDOM.render(<TopBar/>, document.getElementById("top_bar_div"));
ReactDOM.render(<Sliders/>, document.getElementById("sliders_div"));
ReactDOM.render(<DataDisplay/>, document.getElementById("data_div"));