import React from "react";
import CSSModules from 'react-css-modules';
import styles from '../styles/Piece.css';

class Piece extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div style={this.props.pieceStyle}>
                <img src={this.props.image} style={{width: 'inherit', height: 'inherit'}}/>
            </div>
        )
    }
} 

export default CSSModules(Piece, styles);
