/**
 * Created by zhengquanbai on 16/10/24.
 */
import React from 'react';

export default class extends React.Component {
    render() {
        let backgroundColor = 'white';
        if (this.props.highlight) backgroundColor = 'pink';
        return (
            <button className="square"
                    style={{backgroundColor}}
                    onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }
}