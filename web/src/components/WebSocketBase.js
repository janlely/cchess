import React from "react";
import HashMap from 'hashmap';

class WebSocketBase extends React.Component{
    constructor(props){
        super(props)
        this.requestMap = new HashMap()
        this.handlerMap = new HashMap()
        this.props.socket.addEventListener('message', (event) => {
            this.handlerMessage(JSON.parse(event.data));
        })
    }
    handlerMessage(msg) {
        if(msg && msg.id){ //request <-> response
            let request = this.requestMap.get(msg.id);
            if(request && this.handlerMap.has(request.type)){
                this.handlerMap.get(request.type)(request.data, msg.data);
                this.requestMap.remove(msg.id)
            }
        }else{ //notify
            if(this.handlerMap.has(msg.type)){
                this.handlerMap.get(msg.type)(msg.data);
            }
        }
    }
}

export default WebSocketBase;
