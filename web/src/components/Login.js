import CSSModules from 'react-css-modules';
import styles from "../styles/Login.css";
import SignInFrom from './SignInForm.js'
import WebSocketBase from './WebSocketBase.js';
import React from 'react'; //needed

class Login extends WebSocketBase{
	constructor(props) {
		super(props);
        this.state = {
            SignInHasError : false,
            SignInErrorMsg : '',
            SignUpHasError : false,
            SignUpErrorMsg : '' 
        }
        this.requestType = {
            login : 'LOGIN',
            signup: 'SIGNUP'
        }
        this.handlerMap.set(this.requestType.login, (req, res) => {
            this.handlerLoginRes(req, res)
        });
        this.handlerMap.set(this.requestType.signup, (req, res) => {
            this.handlerSignUpRes(req, res)
        });
	}
    handlerLoginRes(req, res){
        console.log(req)
        console.log(res)
        if(res && res.ok){
            this.props.history.push('/arena');
        }else{
            this.setState({
                SignInErrorMsg: res.error,
                SignInHasError: true

            })
        }
    }
    handlerSignUpRes(req, res){
        if(res && res.ok){
            this.props.history.push('/')
        }else{
            this.setState({
                SignUpHasError: true,
                SignUpErrorMsg: res.error
            })
        }
    }
    handlerNotify(msg) {
    }
    handlerSignIn(username, password){
        let request = {
            id: Date.now(),
            type: this.requestType.login,
            data: {
                username: username,
                password: password
            }
        }
        this.requestMap.set(request.id, request)
        this.props.socket.send(JSON.stringify(request))
    }
    handlerSignUp(username, password){
        let request = {
            id: Date.now(),
            type: this.requestType.signup,
            data: {
                username: username,
                password: password
            }
        }
        this.requestMap.set(request.id, request)
        this.props.socket.send(JSON.stringify(request))
    }
    render() {
        return (
            <div styleName="sign-panel">
                <SignInFrom
                    SignInHasError={this.state.SignInHasError}
                    SignInErrorMsg={this.state.SignInErrorMsg}
                    SignUpHasError={this.state.SignUpHasError}
                    SignUpErrorMsg={this.state.SignUpErrorMsg}
                    handlerSignIn={(u,p) => this.handlerSignIn(u, p)}
                    handlerSignUp={(u,p) => this.handlerSignUp(u, p)}
                />
            </div>
        )
    }
}

export default CSSModules(Login, styles);


