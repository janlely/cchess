import React from "react";
import CSSModules from 'react-css-modules';
import styles from '../styles/Situation.css';
import Piece from './Piece.js';
import hongju from '../images/hongju.png';
import hongma from '../images/hongma.png';
import hongxiang from '../images/hongxiang.png';
import hongshi from '../images/hongshi.png';
import hongshuai from '../images/hongshuai.png';
import hongbin from '../images/hongbin.png';
import hongpao from '../images/hongpao.png';
import heiju from '../images/heiju.png';
import heima from '../images/heima.png';
import heixiang from '../images/heixiang.png';
import heishi from '../images/heishi.png';
import heijiang from '../images/heijiang.png';
import heizu from '../images/heizu.png';
import heipao from '../images/heipao.png';
import BlankPiece from './BlankPiece.js';

class Situation extends React.Component{
    constructor(props){
        super(props);
        console.log(this.props.situation)
    }
    handlerPieceClick(id){
        this.props.handlerPieceClick(id);
    }
    render(){
        let blankPieces = []
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 10; j++){
                blankPieces.push(
                    <BlankPiece
                        x = {i}
                        y = {j} 
                        id = {100 + i * 10 + j}
                        handlerClick = {id => this.handlerPieceClick(id)}
                    />
                )
            }
        }
        return(
            <div styleName="main">
                {blankPieces}
                <Piece
                    id = {1}
                    xyzo = {this.props.situation[1]}
                    isRed = {true}
                    overturn = {this.props.overturn}
                    handlerClick = {id => this.handlerPieceClick(id)}
                    image = {hongju}
                />
            </div>
        )
    }
}

export default CSSModules(Situation, styles);
