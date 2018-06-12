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
    getImageById(id){
        if([1, 9].indexOf(id) != -1){
            return hongju;
        }else if([2, 8].indexOf(id) != -1){
            return hongma;
        }else if([3, 7].indexOf(id) != -1){
            return hongxiang;
        }else if([4, 6].indexOf(id) != -1){
            return hongshi;
        }else if(id == 5){
            return hongshuai;
        }else if([10, 11, 12, 13, 14].indexOf(id) != -1){
            return hongbin;
        }else if([15, 16].indexOf(id) != -1){
            return hongpao;
        }else if([17, 25].indexOf(id) != -1){
            return heiju;
        }else if([18, 24].indexOf(id) != -1){
            return heima;
        }else if([19, 23].indexOf(id) != -1){
            return heixiang;
        }else if([20, 22].indexOf(id) != -1){
            return heishi;
        }else if(id == 21){
            return heijiang;
        }else if([26, 27, 28, 29, 30].indexOf(id) != -1){
            return heizu;
        }else if([31, 32].indexOf(id) != -1){
            return heipao;
        }
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
        let redPieces = []
        for(let i = 1; i <= 16; i++){
            redPieces.push(
                <Piece
                    id = {i}
                    xyzo = {this.props.situation[i]}
                    isRed = {true}
                    overturn = {this.props.overturn}
                    handlerClick = {id => this.handlerPieceClick(id)}
                    isPickedUp={i == this.props.pickedId}
                    image = {this.getImageById(i)}
                />
            )
        }
        let blackPieces = []
        for(let i = 17; i <= 32; i++){
            blackPieces.push(
                <Piece
                    id = {i}
                    xyzo = {this.props.situation[i]}
                    isRed = {false}
                    overturn = {this.props.overturn}
                    handlerClick = {id => this.handlerPieceClick(id)}
                    isPickedUp={i == this.props.pickedId}
                    image = {this.getImageById(i)}
                />
            )
        }
        return(
            <div styleName="main">
                {blankPieces}
                {redPieces}
                {blackPieces}
            </div>
        )
    }
}

export default CSSModules(Situation, styles);
