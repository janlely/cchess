
import React from "react";
import ReactDOM from "react-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CSSModules from 'react-css-modules';
import styles from "../styles/SignInForm.css";
import "react-tabs/style/react-tabs.css";

class SignInFrom extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            Iusername : '',
            Ipassword : '',
            Uusername : '',
            Upassword : ''
        }
    }
    handlerIUChange(evt) {
        this.setState({
            Iusername : evt.target.value
        })
    }
    handlerIPChange(evt) {
        this.setState({
            Ipassword : evt.target.value
        })
    }
    handlerUUChange(evt) {
        this.setState({
            Uusername : evt.target.value
        })
    }
    handlerUPChange(evt) {
        this.setState({
            Upassword : evt.target.value
        })
    }
    render() {
        return (
            <Tabs>
                <TabList>
                    <Tab>Sign In</Tab>
                    <Tab>Sign Up</Tab>
                </TabList>
                <TabPanel>
                    <div styleName="sign-input" >
                        <input type="text" required placeholder="username" onChange={evt => this.handlerIUChange(evt)}/>
                        <p hidden={!this.props.SignInHasError}>{this.props.SignInErrorMsg}</p>
                    </div>
                    <div styleName="sign-input" >
                        <input type="password" required placeholder="password" onChange={evt => this.handlerIPChange(evt)}/>
                    </div>
                    <div>
                        <button styleName="sign-btn" onClick={() => this.props.handlerSignIn(this.state.Iusername, this.state.Ipassword)}>Sign In</button>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div styleName="sign-input" >
                        <input type="text" required placeholder="username" onChange={evt => this.handlerUUChange(evt)}/>
                        <p hidden={!this.props.SignUpHasError}>{this.props.SignUpErrorMsg}</p>
                    </div>
                    <div styleName="sign-input" >
                        <input type="password" required placeholder="password" onChange={evt => this.handlerUPChange(evt)}/>
                    </div>
                    <div>
                        <button styleName="sign-btn" onClick={() => this.props.handlerSignUp(this.state.Uusername, this.state.Upassword)}>Sign Up</button>
                    </div>
                </TabPanel>
            </Tabs>
        )
    }
}

export default CSSModules(SignInFrom, styles);


