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
        super(props)
    }
    positionToStyle(pos, overturn){
        return {
            position: 'absolute',
            width: '46px',
            height: '46px',
            left: (!overturn && pos.r ? (2 + (8-pos.x) * 50) : (2 + pos.x * 50)) + 'px',
            top: (!overturn && pos.r ? (2 + (9-pos.y) * 50) : (2 + pos.y * 50)) + 'px'
        }
    }
    render(){
        return(
            <div styleName="main">
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongju1, this.props.situation.overturn)}
                    image={hongju}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongma1, this.props.situation.overturn)}
                    image={hongma}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongxiang1, this.props.situation.overturn)}
                    image={hongxiang}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongshi1, this.props.situation.overturn)}
                    image={hongshi}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongshuai, this.props.situation.overturn)}
                    image={hongshuai}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongshi2, this.props.situation.overturn)}
                    image={hongshi}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongxiang2, this.props.situation.overturn)}
                    image={hongxiang}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongma2, this.props.situation.overturn)}
                    image={hongma}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongju2, this.props.situation.overturn)}
                    image={hongju}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongbin1, this.props.situation.overturn)}
                    image={hongbin}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongbin2, this.props.situation.overturn)}
                    image={hongbin}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongbin3, this.props.situation.overturn)}
                    image={hongbin}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongbin4, this.props.situation.overturn)}
                    image={hongbin}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongbin5, this.props.situation.overturn)}
                    image={hongbin}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongpao1, this.props.situation.overturn)}
                    image={hongpao}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.hongpao2, this.props.situation.overturn)}
                    image={hongpao}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heiju1, this.props.situation.overturn)}
                    image={heiju}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heima1, this.props.situation.overturn)}
                    image={heima}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heixiang1, this.props.situation.overturn)}
                    image={heixiang}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heishi1, this.props.situation.overturn)}
                    image={heishi}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heijiang, this.props.situation.overturn)}
                    image={heijiang}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heishi2, this.props.situation.overturn)}
                    image={heishi}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heixiang2, this.props.situation.overturn)}
                    image={heixiang}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heima2, this.props.situation.overturn)}
                    image={heima}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heiju2, this.props.situation.overturn)}
                    image={heiju}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heizu1, this.props.situation.overturn)}
                    image={heizu}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heizu2, this.props.situation.overturn)}
                    image={heizu}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heizu3, this.props.situation.overturn)}
                    image={heizu}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heizu4, this.props.situation.overturn)}
                    image={heizu}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heizu5, this.props.situation.overturn)}
                    image={heizu}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heipao1, this.props.situation.overturn)}
                    image={heipao}
                />
                <Piece
                    pieceStyle={this.positionToStyle(this.props.situation.heipao2, this.props.situation.overturn)}
                    image={heipao}
                />
            </div>
        )
    }
}

export default CSSModules(Situation, styles);
