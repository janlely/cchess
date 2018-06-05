import React from "react";
import CSSModules from 'react-css-modules';
import styles from '../styles/BlankPiece.css';

class BlankPiece extends React.Component{
    constructor(props){
        super(props)
    }
    positionToStyle(x, y){
        return {
            position: 'absolute',
            width: '46px',
            height: '46px',
            left: (2 + (8-pos.x) * 50) + 'px',
            top: (2 + (9-pos.y) * 50) + 'px',
            zIndex: 1
        }
    }
    render(){
        return(
            <div style={this.positionToStyle(this.prosp.x, this.props.y)}>
            </div>
        )
    }
} 

export default CSSModules(BlankPiece, styles);
