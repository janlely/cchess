import winston from 'winston';
import HashMap from 'hashmap';

class MessageHandler{
    constructor(db, dataBaseName){
        this.db = db;
        this.dataBaseName = dataBaseName;
        this.handlerMap = new HashMap();
        this.TYPE_LOGIN = 'LOGIN';
        this.TYPE_LOGOUT = 'LOGOUT';
        this.handlerMap.set(this.TYPE_LOGIN, (ws, msg) => {
            this.handlerLogin(ws, msg);
        });
        this.handlerMap.set(this.TYPE_LOGOUT, (ws) => {
            this.handlerLogout(ws);
        })
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
    async handlerLogin(ws, msg){
        let result = await this.db.db(this.dataBaseName).collection('user').findOne({name: msg.data.username, password: msg.data.password});
        if(result && result.name){
            result.ok = 'ok';
            result.id = msg.id;
            ws.send(JSON.stringify(result))
        }else{
            ws.send(JSON.stringify({
                id: msg.id,
                error: 'wrong name or password'
            }))
        }
    }
    handlerClose(ws) {
    }
}

export default MessageHandler;
