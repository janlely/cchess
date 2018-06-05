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

class Situation extends React.Component{
    constructor(props){
        super(props);
        this.enrich(this.props.situation);
    }
    handlerPieceClick(id){
        this.props.handlerPieceClick(id);
    }
    render(){
        return(
            <div styleName="main">
                {
                    for(let i = 0; i < 9; i++){
                        for(let j = 0; j < 10; j++){
                            <BlankPiece
                                x = {i}
                                y = {j} 
                            />
                        }
                    }
                }
                {
                    this.props.tx.hongju1 ? 
                        <Anime easing="easeOutElastic"
                            loop={false}
                            autoplay={true}
                            duration={1000}
                            translateX={this.props.tx.hongju1.x}
                            translateY={this.props.tx.hongju1.y}>
                            <Piece
                                id = 0
                                xyzo = {this.props.situation[0]}
                                isRed = true
                                overturn = {this.props.overturn}
                                handlerClick = {id => this.handlerClickPiece(id)}
                                image = {hongju}
                            />
                        </Anime>
                        : 
                        <Piece
                            id = 0
                            xyzo = {this.props.situationi[0]}
                            isRed = true
                            overturn = {this.props.overturn}
                            handlerClick = {id => this.handlerClickPiece(id)}
                            image = {hongju}
                        />
                }

            </div>
        )
    }
}

export default CSSModules(Situation, styles);
