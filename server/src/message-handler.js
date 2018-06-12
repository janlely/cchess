import winston from 'winston';
import HashMap from 'hashmap';
import MatchHelper from './match-helper.js';
import {MysqlMapper} from './mysql-mapper.js';
import Format from 'string-format';
import Redis from 'redis';
import Bluebird from 'bluebird';
import UUID from 'uuid/v1';

Format.extend(String.prototype, {});
Bluebird.promisifyAll(Redis.RedisClient.prototype);
Bluebird.promisifyAll(Redis.Multi.prototype);

class MessageHandler{
    constructor(db, dataBaseName){
        this.redis = Redis.createClient();
        this.mysqldb = db;
        this.dataBaseName = dataBaseName;
        this.handlerMap = new HashMap();
        this.connUserMap = new HashMap();
        this.userConnMap = new HashMap();
        this.requestType = {
            login: 'LOGIN',
            signup: 'SIGNUP',
            logout: 'LOGOUT',
            findMatch: 'FIND_MATCH',
            applyMove: 'APPLY_MOVE',
            enemyMove: 'ENEMY_MOVE'
        }
        this.redisKeys = {
            userRoomIdKey : 'CCHESS_USER_ROOMID',
            roomMoveHistroyKey : 'CCHESS_ROOM_HISTORY',
            roomCurrentStepId : 'CCHESS_ROOM_CURRENT_STEPID'
        }
        this.handlerMap.set(this.requestType.login, (ws, msg) => {
            this.handlerLogin(ws, msg);
        });
        this.handlerMap.set(this.requestType.logout, (ws) => {
            this.handlerLogout(ws);
        })
        this.handlerMap.set(this.requestType.signup, (ws, msg) => {
            this.handlerSignUp(ws, msg)
        })
        this.handlerMap.set(this.requestType.findMatch, (ws, msg) => {
            this.handlerFindMatch(ws, msg);
        })
        this.handlerMap.set(this.requestType.applyMove, (ws, msg) => {
            this.handlerApplyMove(ws, msg);
        })
        this.matchHelper = new MatchHelper(this.redis)
    }
    handlerMessage(ws, msg) {
        winston.info('message received: %s', msg)
        let msgJson = JSON.parse(msg)
        if(!msgJson || !msgJson.type){
            winston.info('invalid message: %s', msg)
        }else{
            this.handlerMap.get(msgJson.type)(ws, msgJson);
        }
    }
    async handlerApplyMove(ws, msg){
        msg = msg.data;
        let roomId = msg.roomId;
        let stepId = msg.stepId;
        //存redis
        let stepCode = [msg.fromId, msg.toId, ...msg.fromXY, ...msg.toXY];
        this.redis.hset([this.redisKeys.roomMoveHistroyKey + '_' + roomId, stepId, stepCode])
        this.redis.set(this.redisKeys.roomCurrentStepId, stepId);
        //查对手的id
        let users = await this.redis.hgetAsync(roomId, 'USERS');
        console.log(users)
        users = users.split(',').map(num => parseInt(num, 10));
        let theUserId = this.connUserMap.get(ws);
        let enemyId = (theUserId == users[0]) ? users[1] : users[0];
        console.log(enemyId)
        //查对手的ws
        let enemyWs = this.userConnMap.get(enemyId);
        console.log(enemyWs)
        if(enemyWs){
            enemyWs.send(JSON.stringify({
                type: this.requestType.enemyMove,
                data: {
                    fromId: msg.fromId,
                    toId: msg.toId,
                    stepId: stepId
                }
            }))
        }
    }
    async handlerFindMatch(ws, msg) {
        
        let userId = this.connUserMap.get(ws);
        if(!userId) {
            ws.send(JSON.stringify({
                id: msg.id,
                type: this.requestType.findMatch,
                error: 'user not login'
            }))
            return;
        }
        let userInfo = await this.mysqldb.queryAsync(MysqlMapper.getUserBattleInfo.format(userId))
        this.matchHelper.push(userId, userInfo[0].score, Date.now());
        let matchedUsers = await this.matchHelper.pop(userId, userInfo[0].score);
        //let matchedUsers = [1, 2]
        if(matchedUsers){
            this.initBattleRoom(matchedUsers);
        }
    }
    initBattleRoom(users){
        let roomId = UUID().toUpperCase();
        let redId = Date.now() % 2 ? users[0] : users[1];
        //let redId = 2;
        this.redis.hset([roomId, 'USERS', users]);
        this.redis.hset([roomId, 'RED', redId])
        this.redis.hset([this.redisKeys.userRoomIdKey, users[0], roomId])
        this.redis.hset([this.redisKeys.userRoomIdKey, users[1], roomId])
        console.log(users)
        let ws1 = this.userConnMap.get(users[0]);
        let ws2 = this.userConnMap.get(users[1]);
        console.log(this.userConnMap)
        console.log(users[0])
        console.log(ws1 ? true : false)
        console.log(ws2 ? true : false)
        console.log(redId == users[0])
        console.log(redId == users[1])
        if(ws1){
            ws1.send(JSON.stringify({
                type : this.requestType.findMatch,
                data : {
                    roomId : roomId,
                    red : redId == users[0],
                    stepTime : 60,
                    matchTime : 1200,
                    selfHeadUrl : '',
                    enemyHeadUrl : ''
                }
            }));
        }
        if(ws2){
            ws2.send(JSON.stringify({
                type : this.requestType.findMatch,
                data : {
                    roomId : roomId,
                    red : redId == users[1],
                    stepTime : 60,
                    matchTime : 1200,
                    selfHeadUrl : '',
                    enemyHeadUrl : ''
                }
            }));
        }
    }
    initSession(ws, result){
        if(this.userConnMap.has(result.userId)){
            this.connUserMap.remove(this.userConnMap.get(result.userId))
        }
        this.connUserMap.set(ws, result.userId);
        this.userConnMap.set(result.userId, ws);
    }
    async handlerLogin(ws, msg){
        let result = await this.mysqldb.queryAsync(MysqlMapper.getUserByNamePass.format(msg.data.username, msg.data.password))
        if(result && result[0]){
            this.initSession(ws, result[0]);
            ws.send(JSON.stringify({
                id : msg.id,
                data : {
                    ok : 'ok'
                }
            }))
        }else{
            ws.send(JSON.stringify({
                id: msg.id,
                data : {
                    error: 'wrong name or password'
                }
            }))
        }
    }
    async handlerSignUp(ws, msg){
        let result = await this.mysqldb.queryAsync(MysqlMapper.checkUserExist.format(msg.data.username));
        if(result && result[0]){
            ws.send(JSON.stringify({
                error : 'user exist',
                id : msg.id
            }))
        }
        let result2 = await this.mysqldb.queryAsync(MysqlMapper.addNewUser.format(msg.data.username, msg.data.password));
        console.log("sign up result: " + result2)
    }
    handlerClose(ws) {
    }
}

export default MessageHandler;
