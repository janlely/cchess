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
            findingMatchHidden: true,
            selfName: '',
            selfHeadUrl: '',
            selfStepTime: 0,
            selfMatchTime: 0,
            enemyName: '',
            enemyHeadUrl: '',
            enemyStepTime: 0,
            enemyMatchTime: 0
        }
        this.matchFound = false;
        this.requestType = {
            findMatch : 'FIND_MATCH'
        }
        this.handlerMap.set(this.requestType.findMatch, (req, res) => {
            this.handlerFindMatchRes(req, res);
        })
        this.handlerMap.set(this.requestType.enemyMove, (msg) => {
            this.handlerEnemyMove(msg);
        })
    }
    handlerEnemyMove(msg){
        
    }
    handlerFindMatchRes(req, res){
        this.setState({
            selfStepTime: res.stepTime,
            selfMatchTime: res.MatchTime,
            enemyStepTime: res.stepTime,
            enemyMatchTime: res.MatchTime,
            findingMatchHidden : true,
            timePanelHidden: false,
            situation: {
                overturn: !res.red,
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
    handlerMessage(msg){
    }
    findMatch() {
        let request = {
            id: Date.now(),
            type: this.requestType.findMatch
        }
        this.requestMap.set(request.id, request);
        this.props.socket.send(JSON.stringify(request))
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
    handlerTimePanelConfirm() {
        this.timer = setInterval(() => {
            if(this.yourTurn){
                this.setState({
                    selfStepTime: this.dec(this.state.selfStepTime),
                    selfMatchTime: this.dec(this.state.selfMatchTime)
                })
            }else{
                this.setState({
                    enemyStepTime: this.dec(this.state.enemyStepTime),
                    enemyMatchTime: this.dec(this.state.enemyMatchTime)
                })
            }
        }, 1000)
    }
    dec(time) {
        if(time > 0){
            return time - 1;
        }
        return time;
    }
    render() {
        return (
            <div>
                <InfoPanel 
                    alignLeft=true
                    headUrl={this.state.enemyHeadUrl}
                    stepTime={this.state.enemyStepTime}
                    matchTime={this.state.enemyMatchTime}
                    name={this.state.enemyName}
                />
                <div styleName="board">
                    <Board/>
                    <MatchingBtn
                        hidden={this.state.matchBtnHidden}
                        handlerMatchBtnClick={() => this.handlerMatchBtnClick()}
                    />
                    <TimePanel hidden={this.state.timePanelHidden} onConfirmClick={() => this.handlerTimePanelConfirm()}/>
                    <FindingMatch hidden={this.state.findingMatchHidden}/>
                    {this.state.situation && <Situation situation={this.state.situation}/>}
                </div>
                <InfoPanel 
                    alignLeft=false
                    headUrl={this.state.selfHeadUrl}
                    stepTime={this.state.selfStepTime}
                    matchTime={this.state.selfMatchTime}
                    name={this.state.selfName}
                />
                <ConsoleKeyboard/>
            </div>
        )
    }
}

export default CSSModules(Arena, styles);
