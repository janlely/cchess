import React from "react";
import CSSModules from 'react-css-modules';
import styles from '../styles/InfoPanel.css';
import unknownHead from '../images/unknown_head.png';

class InfoPanel extends React.Component{
    constructor(props){
        super(props)
    }
    formatTime(time){
        return Math.floor(time / 60).toString().padStart(2, '0') + ':' + (time % 60).toString().padStart(2, '0');
    }
    render() {
        return(
            <div styleName="containor">
                <div styleName={this.props.alignLeft ? 'left' : 'right'}>
                    <img src={this.props.headUrl ? this.props.headUrl : unknownHead}/>
                </div>
                <div styleName={this.props.alignLeft ? 'left' : 'right'}>
                    <p>{this.props.name}</p>
                    <p>{this.formatTime(this.props.matchTime)}</p>
                    <p>{this.formatTime(this.props.stepTime)}</p>
                </div>
            </div>
        )

    }
}

export default CSSModules(InfoPanel, styles);

