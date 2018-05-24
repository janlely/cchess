import React from "react";
import ReactDOM from "react-dom";
import Login from "./components/Login.js";
import Arena from "./components/Arena.js";
import { BrowserRouter, Route, Switch} from 'react-router-dom';

const ws = new WebSocket('ws://127.0.0.1:4000');

ws.onopen = () => {
    console.log('connection created')
}
const App = () => (
    <Switch>
        <Route exact path="/" render={(props) => <Login {...props} socket={ws}/>} />
        <Route path="/arena" render={(props) => <Arena {...props} socket={ws}/>} />
    </Switch>
)

ReactDOM.render(
    <BrowserRouter basename='/cchess'>
        <App/>
    </BrowserRouter>
, document.getElementById("root"));
