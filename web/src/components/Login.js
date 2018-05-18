import React from "react";
import CSSModules from 'react-css-modules';
import styles from "../styles/Login.css";
import SignInFrom from './SignInForm.js'
import $ from 'jquery';

class Login extends React.Component {
	constructor(props) {
		super(props);
        this.state = {
            SignInHasError : false,
            SignInErrorMsg : '',
            SignUpHasError : false,
            SignUpErrorMsg : '' 
        }
	}
    handlerSignIn(username, password){
        console.log(username);
        console.log(password);
        $.get('/cserver/login', {username: username, password: password}, res => {
            if(res && res.ok){
                this.props.history.push('/arena');
            }else{
                this.setState({
                    SignInErrorMsg: res.error,
                    SignInHasError: true

                })
            }
        })
    }
    handlerSignUp(username, password){
        console.log(username);
        console.log(password);
        $.get('/cserver/signup', {username: username, password: password}, res => {
            if(res && res.ok){
                this.props.history.push('/')
            }else{
                this.setState({
                    SignUpHasError: true,
                    SignUpErrorMsg: res.error
                })
            }
        })
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


