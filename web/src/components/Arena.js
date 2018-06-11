import React from "react";
import CSSModules from 'react-css-modules';
import styles from '../styles/Arena.css';
import Board from './Board.js';
import MatchingBtn from './MatchingBtn.js';
import ConsoleKeyboard from './ConsoleKeyboard.js';
import FindingMatch from './FindingMatch.js';
import Situation from './Situation.js';
import WebSocketBase from './WebSocketBase.js';
import InfoPanel from './InfoPanel.js';

class Arena extends WebSocketBase{
    constructor(props) {
        super(props);
        this.state = {
            matchBtnHidden: false,
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
            findMatch : 'FIND_MATCH',
            applyMove : 'APPLY_MOVE'
        }
        this.handlerMap.set(this.requestType.findMatch, (res) => {
            this.handlerFindMatchRes(res);
        })
        this.handlerMap.set(this.requestType.applyMove, (req, res) => {
            this.handlerApplyMove(req, res)
        })
        this.handlerMap.set(this.requestType.enemyMove, (msg) => {
            this.handlerEnemyMove(msg);
        })
        this.move = {}
    }
    handlerApplyMove(req, res){
    }
    handlerEnemyMove(msg){
        if(this.stepId != msg.stepId){
            console.log("stepId is wrong, this.stepId: " + this.stepId + " that.stepId: " + msg.stepId)
        }
        this.stepId = msg.stepId + 1;
    }
    genTranslate(id1, id2){
        let result = {}
        let x = 0;
        let y = 0;
        if(id2 < 100){
            let x = this.situation[id1].x - (8 - this.situation[id2].x);
            let y = this.situation[id1].y - (9 - this.situation[id2].y);
        }else{
            let x = this.situation[id1].x - Math.round((id2 - 100) / 10);
            let y = this.situation[id1].y - (id2 % 10);
        }
        result[id1] = {
            x: x,
            y: y
        }
        return result;
    }
    handlerPieceClick(id) {
        if(!this.yourTurn){
            return
        }
        if(!this.move.fromId){//选子
            if(this.youRed && id <= 15){ //红方只能移动红子
                this.move.fromId = id
                return
            }
            if(!this.youRed && id > 15 && id <=31){//黑方只能移动黑子
                this.move.fromId = id
                return
            }
        }else{ //走子或吃对方子
            let id1 = this.move.fromId;
            let id2 = id;
            if(this.youRed && id2 <= 15){ //红方只能吃黑方子
                return
            }
            if(!this.youRed && id2 > 15 && id2 <=31){//黑方只能吃红方子
                return
            }
            if(!this.legalMove(id1, id2)){ //判断是否符合规则
                return;
            }
            //更新this.situation
            let toXY = this.getXYFromId(id2);
            this.situation[id1].x = toXY[0];
            this.situation[id1].y = toXY[1];
            if(id2 < 100){
                this.situation[id2].z = -2;
            }
            this.setState({
                situation: this.situation
            })
            this.yourTurn = !this.yourTurn
            //调后端接口
            let request = {
                id: Date.now(),
                type: this.requestType.applyMove,
                data: {
                    roomId: this.roomId,
                    fromId: id1,
                    fromXY: [this.state.overturn, this.situation[id1].x, this.situation[id1].y],
                    toId: id2,
                    toXY: [this.state.overturn, ...toXY],
                    stepId: this.stepId,
                    redStepTime: this.youRed ? this.state.selfStepTime : this.state.enemyStepTime,
                    redMatchTime: this.youRed ? this.state.selfMatchTime : this.state.enemyMatchTime,
                    blackStepTime: this.youRed ? this.state.enemyStepTime : this.state.selfStepTime,
                    blackMatchTime: this.youRed ? this.state.enemyMatchTime : this.state.selfMatchTime
                }
            }
            this.requestMap.set(request.id, request);
            this.props.socket.send(JSON.stringify(request));
            this.move = {}
        }
    }
    getXYFromId(id){
        if(id <= 16){
            if(!this.state.overturn){//未翻转
                return [this.situation[id].x, this.situation[id].y];
            }else{
                return [8 - this.situation[id].x, 9 - this.situation[id].y];
            }
        }else if(id <= 32){
            if(this.state.overturn){//翻转
                return [this.situation[id].x, this.situation[id].y];
            }else{
                return [8 - this.situation[id].x, 9 - this.situation[id].y];
            }
        }else{
            return [Math.round((id % 100) / 10), (id % 100) % 10];
        }
    }
    legalMove(id1, id2){
        let fromXY = this.getXYFromId(id1);
        let toXY = this.getXYFromId(id2);
        if([1, 9, 17, 25].indexOf(id1) != -1){ //车
            if(fromXY[0] != toXY[0] && fromXY[1] != toXY[1]){ //车只能横竖移动
                return false;
            }
            if(fromXY[0] == toXY[0]){ //竖移
                let x = fromXY[0];
                for(let i = Math.min(fromXY[1], toXY[1]) + 1; i < Math.max(fromXY[1], toXY[1]); i++){
                    if(this.situation_[x][i] != 0){ //路径上不能有其他棋子
                        return false;
                    }
                }
            }else{
                let y = fromXY[1];
                for(let i = Math.min(fromXY[0], toXY[0]) + 1; i < Math.max(fromXY[0], toXY[0]); i++){
                    if(this.situation_[i][y] != 0){ //路径上不能有其他棋子
                        return false;
                    }
                }
            }
        }else if([2, 8, 18, 24].indexOf(id1) != -1){ //马
            if((fromXY[0] - toXY[0])*(fromXY[0] - toXY[0]) + (fromXY[1] - toXY[1])*(fromXY[1] - toXY[1]) != 5){ //马走日 
                return false;
            }
            if(fromXY[0] + 2 == toXY[0] &&  this.situation_[fromXY[0] + 1][fromXY[1]] != 0){//别脚
                return false;
            }
            if(fromXY[0] - 2 == toXY[0] &&  this.situation_[fromXY[0] - 1][fromXY[1]] != 0){//别脚
                return false;
            }
            if(fromXY[1] + 2 == toXY[1] &&  this.situation_[fromXY[0]][fromXY[1] + 1] != 0){//别脚
                return false;
            }
            if(fromXY[1] - 2 == toXY[1] &&  this.situation_[fromXY[0]][fromXY[1] - 1] != 0){//别脚
                return false;
            }
        }else if([15, 16, 31, 32].indexOf(id1) != -1){//炮
            if(fromXY[0] != toXY[0] && fromXY[1] != toXY[1]){ //炮只能横竖移动
                return false;
            }
            if(this.situation_[toXY[0]][toXY[1]] != 0){ //吃子
                if(fromXY[0] == toXY[0]){ //竖移
                    let count = 0;
                    for(let i = Math.min(fromXY[1], toXY[1]) + 1; i < Math.max(fromXY[1], toXY[1]); i++){
                        if(this.situation_[fromXY[0]][i] != 0){
                            count++
                        }
                    }
                    if(count != 1){
                        return false;
                    }
                }else{ //横移
                    let count = 0;
                    for(let i = Math.min(fromXY[0], toXY[0]) + 1; i < Math.max(fromXY[0], toXY[0]); i++){
                        if(this.situation_[i][fromXY[1]] != 0){
                            count++
                        }
                    }
                    if(count != 1){
                        return false;
                    }
                }
            }else{ //移动
                if(fromXY[0] == toXY[0]){ //竖移
                    for(let i = Math.min(fromXY[1], toXY[1]) + 1; i < Math.max(fromXY[1], toXY[1]); i++){
                        if(this.situation_[fromXY[0]][i] != 0){
                            return false;
                        }
                    }
                }else{ //横移
                    for(let i = Math.min(fromXY[0], toXY[0]) + 1; i < Math.max(fromXY[0], toXY[0]); i++){
                        if(this.situation_[i][fromXY[1]] != 0){
                            return false;
                        }
                    }
                }
            }
        }else if([3, 7, 19, 23].indexOf(id1) != -1){ //象

            if((fromXY[0] - toXY[0])*(fromXY[0] - toXY[0]) + (fromXY[1] - toXY[1])*(fromXY[1] - toXY[1]) != 8){ //象飞田
                return false;
            }
            if(this.situation_[(fromXY[0] + toXY[0]) / 2][(fromXY[1] + toXY[1]) / 2] != 0){ //象眼被压
                return false;
            }
        }else if([4, 6, 20, 22].indexOf(id1) != -1){ //士

            if(toXY[0] < 3 || toXY[0] > 5){
                return false;
            }
            if(toXY[1] > 2 && toXY[1] < 7){
                return false;
            }
            if((fromXY[0] - toXY[0])*(fromXY[0] - toXY[0]) + (fromXY[1] - toXY[1])*(fromXY[1] - toXY[1]) != 2){ 
                return false;
            }
        }else if([5, 21].indexOf(id1) != -1){//将帅

            if(toXY[0] < 3 || toXY[0] > 5){
                return false;
            }
            if(toXY[1] > 2 && toXY[1] < 7){
                return false;
            }
            if((fromXY[0] - toXY[0])*(fromXY[0] - toXY[0]) + (fromXY[1] - toXY[1])*(fromXY[1] - toXY[1]) != 1){ 
                return false;
            }
        }else if([10, 11, 12, 13, 14].indexOf(id1) != -1){ //红兵

            if((fromXY[0] - toXY[0])*(fromXY[0] - toXY[0]) + (fromXY[1] - toXY[1])*(fromXY[1] - toXY[1]) != 1){ 
                return false;
            }
            if(!this.state.overturn){//棋盘未翻转
                if(fromXY[1] > toXY[1]){ //不能后退
                    return false;
                }
                if(fromXY[1] < 5 && fromXY[0] != toXY[0]){ //未过河，不能横移
                    return false;
                }
            }else{//棋盘翻转
                if(fromXY[1] < toXY[1]){ //不能后退
                    return false;
                }
                if(fromXY[1] > 4 && fromXY[0] != toXY[0]){ //未过河，不能横移
                    return false;
                }
            }
        }else if([26, 27, 28, 29, 30].indexOf(id1) != -1){//黑卒
        
            if((fromXY[0] - toXY[0])*(fromXY[0] - toXY[0]) + (fromXY[1] - toXY[1])*(fromXY[1] - toXY[1]) != 1){ 
                return false;
            }
            if(!this.state.overturn){//棋盘未翻转
                if(fromXY[1] < toXY[1]){ //不能后退
                    return false;
                }
                if(fromXY[1] > 4 && fromXY[0] != toXY[0]){ //未过河，不能横移
                    return false;
                }
            }else{//棋盘翻转
                if(fromXY[1] > toXY[1]){ //不能后退
                    return false;
                }
                if(fromXY[1] < 5 && fromXY[0] != toXY[0]){ //未过河，不能横移
                    return false;
                }
            }
        }

        return true;
    }
    initSituation(overturn) {
        let situation = []
        situation[1] = {x: 0,y: 0,z: 2,o: 1}; //right-ju
        situation[2] = {x: 1,y: 0,z: 2,o: 1}; //right-ma
        situation[3] = {x: 2,y: 0,z: 2,o: 1}; //right-xiang
        situation[4] = {x: 3,y: 0,z: 2,o: 1}; //right-shi
        situation[5] = {x: 4,y: 0,z: 2,o: 1}; //shuai
        situation[6] = {x: 5,y: 0,z: 2,o: 1}; //left-shi
        situation[7] = {x: 6,y: 0,z: 2,o: 1}; //left-xiang
        situation[8] = {x: 7,y: 0,z: 2,o: 1}; //left-ma
        situation[9] = {x: 8,y: 0,z: 2,o: 1}; //left-ju
        situation[10] = {x: 0,y: 3,z: 2,o: 1}; //bing-1
        situation[11] = {x: 2,y: 3,z: 2,o: 1}; //bing-3
        situation[12] = {x: 4,y: 3,z: 2,o: 1}; //bing-5
        situation[13] = {x: 6,y: 3,z: 2,o: 1}; //bing-7
        situation[14] = {x: 8,y: 3,z: 2,o: 1}; //bing-9
        situation[15] = {x: 1,y: 2,z: 2,o: 1}; //pao-2
        situation[16] = {x: 7,y: 2,z: 2,o: 1}; //pao-8
        situation[17] = {x: 0,y: 0,z: 2,o: 1};
        situation[18] = {x: 1,y: 0,z: 2,o: 1};
        situation[19] = {x: 2,y: 0,z: 2,o: 1};
        situation[20] = {x: 3,y: 0,z: 2,o: 1};
        situation[21] = {x: 4,y: 0,z: 2,o: 1};
        situation[22] = {x: 5,y: 0,z: 2,o: 1};
        situation[23] = {x: 6,y: 0,z: 2,o: 1};
        situation[24] = {x: 7,y: 0,z: 2,o: 1};
        situation[25] = {x: 8,y: 0,z: 2,o: 1};
        situation[26] = {x: 0,y: 3,z: 2,o: 1};
        situation[27] = {x: 2,y: 3,z: 2,o: 1};
        situation[28] = {x: 4,y: 3,z: 2,o: 1};
        situation[29] = {x: 6,y: 3,z: 2,o: 1};
        situation[30] = {x: 8,y: 3,z: 2,o: 1};
        situation[31] = {x: 1,y: 2,z: 2,o: 1};
        situation[32] = {x: 7,y: 2,z: 2,o: 1};
        this.situation_ = this.convertSituation(situation, overturn);
        return situation;
    }
    convertSituation(situation, overturn) {
        let situation_ = [];
        for(let i = 0; i < 9; i++){
            situation_[i] = [];
            for(let j = 0; j < 10; j++){
                situation_[i][j] = 0;
            }
        }

        for(let i = 1; i <= 16; i++){
            let x = !overturn ? situation[i].x : 8 - situation[i].x;
            let y = !overturn ? situation[i].y : 9 - situation[i].y;
            if(situation[i].o == 0){
                situation_[x][y] = 0;
            }else{
                situation_[x][y] = i;
            }
        }

        for(let i = 17; i <= 32; i++){
            let x = !overturn ? 8 - situation[i].x : situation[i].x;
            let y = !overturn ? 9 - situation[i].y : situation[i].y;
            if(situation[i].o == 0){
                situation_[x][y] = 0;
            }else{
                situation_[x][y] = i;
            }
        }
        
        return situation_;
    }
    handlerFindMatchRes(res){
        this.youRed = res.red;
        this.yourTurn = res.red;
        this.roomId = res.roomId;
        this.situation = this.initSituation(!res.red);
        this.stepId = 1;
        this.setState({
            selfStepTime: res.stepTime,
            selfMatchTime: res.MatchTime,
            selfHeadUrl : res.selfHeadUrl,
            enemyStepTime: res.stepTime,
            enemyMatchTime: res.MatchTime,
            enemyHeadUrl : res.enemyHeadUrl,
            findingMatchHidden : true,
            situation: this.situation,
            overturn: !res.red
        })
        this.startGame();
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
        this.findMatch()
    }
    startGame() {
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
                    alignLeft={true}
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
                    <FindingMatch hidden={this.state.findingMatchHidden}/>
                    {this.state.situation
                            && <Situation
                                overturn ={this.state.overturn}
                                situation={this.state.situation}
                                handlerPieceClick = {id => this.handlerPieceClick(id)}
                            />}
                </div>
                <InfoPanel 
                    alignLeft={false}
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
