import React from "react";
import CSSModules from 'react-css-modules';
import styles from '../styles/Arena.css';

class Arena extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <p>welcome</p>
        )
    }
}

export default CSSModules(Arena, styles);
