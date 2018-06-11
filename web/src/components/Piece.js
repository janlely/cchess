import React from "react";
import CSSModules from 'react-css-modules';
import styles from '../styles/Piece.css';

class Piece extends React.Component{
    constructor(props){
        super(props)
    }
    handlerClick(){
        this.props.handlerClick(this.props.id);
    }
    positionToStyle(){
        let x = this.props.xyzo.x;
        let y = this.props.xyzo.y;
        let z = this.props.xyzo.z;
        let isRed = this.props.isRed;
        let overturn = this.props.overturn;
        let o = this.props.xyzo.o;
        return {
            position: 'absolute',
            width: '46px',
            height: '46px',
            left: (!overturn && isRed ? (2 + (8-x) * 50) : (2 + x * 50)) + 'px',
            top: (!overturn && isRed ? (2 + (9-y) * 50) : (2 + y * 50)) + 'px',
            zIndex: z,
            opacity: o
        }
    }
    render(){
        return(
            <div style={this.positionToStyle()} onClick={() => this.handlerClick()}>
                <img src={this.props.image} style={{width: 'inherit', height: 'inherit'}}/>
            </div>
        )
    }
} 

export default CSSModules(Piece, styles);
