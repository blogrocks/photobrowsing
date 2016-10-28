/**
 * Created by zhengquanbai on 16/10/24.
 */
import React from 'react';
import Board from './Board';
import Button from 'Components/Button';
import './game.scss';

export default class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: null,
                winningCause: []
            }],
            xIsNext: true,
            stepNumber: 0,
            Ascending: true,
        };
    }

    handleClick(i) {
        var stepNumber = this.state.stepNumber;
        var history = this.state.history;
        var winningCause = [];

        if (stepNumber < history.length - 1) {
            history = history.slice(0, stepNumber+1);
        }
        var current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        var winnerInfo = calculateWinner(squares);
        if (winnerInfo) winningCause = winnerInfo.winningCause;
        this.setState({
            history: history.concat([{
                squares,
                location: getLocation(3, i),
                winningCause
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
        });
    }

    toggleOrder() {
        this.setState({Ascending: !this.state.Ascending});
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerInfo = calculateWinner(current.squares);

        let status;
        if (winnerInfo) {
            status = 'Winner: ' + winnerInfo.winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        let moves = history.map((step, move) => {
            const desc = move ?
                'Move #' + move + ", location: (" + step.location.x + ", " + step.location.y + ")" :
                'Game start';
            let fontWeight = "normal";
            if (this.state.stepNumber === move) fontWeight = "bold";
            return (
                <li key={move}>
                    <a href="#" style={{fontWeight}} onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            );
        });
        moves = !this.state.Ascending ? moves.reverse() : moves;
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} vitalSquares={current.winningCause}
                            onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <div className="toggle-btn">
                        <Button onClick={() => this.toggleOrder()}>
                            {this.state.Ascending ? 'Descending' : 'Ascending'}
                        </Button>
                    </div>
                    <ol reversed={!this.state.Ascending}>{moves}</ol>
                </div>
            </div>
        );
    }
}


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                winningCause: lines[i]
            };
        }
    }
    return null;
}

function getLocation(dimension, index) {
    return {
        x: Math.floor(index / dimension),
        y: index % dimension
    }
}
