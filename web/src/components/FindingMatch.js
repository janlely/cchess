import React from "react";
import CSSModules from 'react-css-modules';
import styles from '../styles/FindingMatch.css';

class FindingMatch extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div hidden={this.props.hidden} styleName="main">
                <p>finding match....</p>
            </div>
        )
    }
}

export default CSSModules(FindingMatch, styles);
