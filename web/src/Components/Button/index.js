import React from 'react';
import './Button.scss';

export default class extends React.Component {
    render() {
        return (
            <a href="#" className="myButton" onClick={() => this.props.onClick()}>
                {this.props.children}
            </a>
        );
    }
}