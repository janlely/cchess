
import React from "react";
import CSSModules from 'react-css-modules';
import styles from '../styles/MatchingBtn.css';

class MatchingBtn extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <button styleName="match-btn"
                hidden={this.props.hidden} 
                onClick={() => this.props.handlerMatchBtnClick()}
            >Start Matching</button>
        )
    }
}

export default CSSModules(MatchingBtn, styles);
