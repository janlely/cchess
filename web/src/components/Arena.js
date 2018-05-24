import React from "react";
import CSSModules from 'react-css-modules';
import styles from '../styles/Arena.css';
import Board from './Board.js';
import MatchingBtn from './MatchingBtn.js';
import TimePanel from './TimePanel.js';
import ConsoleKeyboard from './ConsoleKeyboard.js';
import FindingMatch from './FindingMatch.js';
import Situation from './Situation.js';
import WebSocketBase from './WebSocketBase.js';

class Arena extends WebSocketBase{
    constructor(props) {
        super(props);
        this.state = {
            matchBtnHidden: false,
            timePanelHidden: true,
            findingMatchHidden: true
        }
        this.matchFound = false;
        this.requestType = {
            findMatch : 'FIND_MATCH'
        }
    }
    handlerMessage(msg){
    }
    findMatch() {
        this.setState({
            findingMatchHidden : true,
            situation: {
                overturn: false,
                hongju1:    {x: 0,y: 0,z: 1, r: 1},
                hongma1:    {x: 1,y: 0,z: 1, r: 1},
                hongxiang1: {x: 2,y: 0,z: 1, r: 1},
                hongshi1:   {x: 3,y: 0,z: 1, r: 1},
                hongshuai:  {x: 4,y: 0,z: 1, r: 1},
                hongshi2:   {x: 5,y: 0,z: 1, r: 1},
                hongxiang2: {x: 6,y: 0,z: 1, r: 1},
                hongma2:    {x: 7,y: 0,z: 1, r: 1},
                hongju2:    {x: 8,y: 0,z: 1, r: 1},
                hongbin1: {x: 0,y: 3,z: 1, r: 1},
                hongbin2: {x: 2,y: 3,z: 1, r: 1},
                hongbin3: {x: 4,y: 3,z: 1, r: 1},
                hongbin4: {x: 6,y: 3,z: 1, r: 1},
                hongbin5: {x: 8,y: 3,z: 1, r: 1},
                hongpao1: {x: 1,y: 2,z: 1, r: 1},
                hongpao2: {x: 7,y: 2,z: 1, r: 1},
                heiju1:    {x: 0,y: 0,z: 1},
                heima1:    {x: 1,y: 0,z: 1},
                heixiang1: {x: 2,y: 0,z: 1},
                heishi1:   {x: 3,y: 0,z: 1},
                heijiang:  {x: 4,y: 0,z: 1},
                heishi2:   {x: 5,y: 0,z: 1},
                heixiang2: {x: 6,y: 0,z: 1},
                heima2:    {x: 7,y: 0,z: 1},
                heiju2:    {x: 8,y: 0,z: 1},
                heizu1:  {x: 0,y: 3,z: 1},
                heizu2:  {x: 2,y: 3,z: 1},
                heizu3:  {x: 4,y: 3,z: 1},
                heizu4:  {x: 6,y: 3,z: 1},
                heizu5:  {x: 8,y: 3,z: 1},
                heipao1: {x: 1,y: 2,z: 1},
                heipao2: {x: 7,y: 2,z: 1}
            }
        })
    }
    handlerMatchBtnClick() {
        this.setState({
            findingMatchHidden: false,
            matchBtnHidden: true
        })
        while(!matchFound){
            setTimeout(() => this.findMatch(), 1000)
        }
    }
    render() {
        return (
            <div>
                <div styleName="board">
                    <Board/>
                    <MatchingBtn
                        hidden={this.state.matchBtnHidden}
                        handlerMatchBtnClick={() => this.handlerMatchBtnClick()}
                    />
                    <TimePanel hidden={this.state.timePanelHidden}/>
                    <FindingMatch hidden={this.state.findingMatchHidden}/>
                    {this.state.situation && <Situation situation={this.state.situation}/>}
                </div>
                <ConsoleKeyboard/>
            </div>
        )
    }
}

export default CSSModules(Arena, styles);
