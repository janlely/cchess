import React from "react";
import ReactDOM from "react-dom";
import Login from "./components/Login.js";
import Arena from "./components/Arena.js";
import { BrowserRouter, Route, Switch} from 'react-router-dom';

const App = () => (
    <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/arena" component={Arena}/>
    </Switch>
)

ReactDOM.render(
    <BrowserRouter basename='/cchess'>
        <App/>
    </BrowserRouter>
, document.getElementById("root"));
