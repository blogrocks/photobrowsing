import React from 'react';
import './Button.scss';

export default class extends React.Component {
    render() {
        return (
            <a href="#" className="myButton" onClick={(e) => {
                e.preventDefault();
                this.props.onClick()
            }}>
                {this.props.children}
            </a>
        );
    }
}