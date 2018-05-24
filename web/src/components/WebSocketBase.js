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
        if(msg && msg.id){
            let request = this.requestMap.get(msg.id);
            if(request && this.handlerMap.has(request.type)){
                this.handlerMap.get(request.type)(request, msg);
                this.requestMap.remove(msg.id)
            }
        }else{
            this.handlerNotify(msg);
        }
    }
    handlerNotify(msg){
    }
}

export default WebSocketBase;
