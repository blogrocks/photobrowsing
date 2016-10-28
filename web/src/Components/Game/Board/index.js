/**
 * Created by zhengquanbai on 16/10/24.
 */
import React from 'react';
import Square from 'Components/Square';

export default class extends React.Component {
    renderSquare(i) {
        let highlight = false;
        if (this.props.vitalSquares
            && this.props.vitalSquares.includes(i)) highlight = true;

        return <Square value={this.props.squares[i]}
                       highlight={highlight}
                       key={i}
                       onClick={() => this.props.onClick(i)} />;
    }
    render() {
        let boardRows = [], index = 0;
        for(let i = 0; i < 3; i++) {
            let boardColumns = [];
            for(let j = 0; j < 3; j++) {
                boardColumns.push(this.renderSquare(index++));
            }
            boardRows.push(
                <div className="board-row" key={i}>
                    {boardColumns}
                </div>
            );
        }
        return (
            <div>
                {boardRows}
            </div>
        );
    }
}
