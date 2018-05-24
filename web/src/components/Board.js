import React from "react";
import CSSModules from 'react-css-modules';
import styles from '../styles/Board.css';
import boardline from '../images/boardlines.png';

class Board extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div styleName="board-bg">
                <div styleName="board-line">
                    <img styleName="board-line-img" src={boardline}/>
                </div>
            </div>
        )
    }
}

export default CSSModules(Board, styles);
