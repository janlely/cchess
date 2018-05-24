import React from "react";
import CSSModules from 'react-css-modules';
import styles from '../styles/ConsoleKeyboard.css';

class ConsoleKeyboard extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div styleName="board">
                <button>pre</button>
                <button>next</button>
                <button>goto</button>
                <button>overturn</button>
            </div>
        )
    }
}

export default CSSModules(ConsoleKeyboard, styles);
