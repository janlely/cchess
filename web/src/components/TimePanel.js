
import React from "react";
import CSSModules from 'react-css-modules';
import styles from '../styles/TimePanel.css';

class TimePanel extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div styleName="time-panel" hidden={this.props.hidden}>
                <p>TimePanel</p>
                <button onClick={() => this.props.onConfirmClick()}>ok</button>
            </div>
        )
    }
}

export default CSSModules(TimePanel, styles);
