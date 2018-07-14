import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square( props ) {
  return (
    <button className={ 'square' + ( props.isWinner ? ' winner' : '' )  } onClick={ props.onClick }>
      { props.value }
    </button>
  );
}

class Board extends React.Component {

  renderSquare( index ) {
    return <Square 
              key={ index }
              value={ this.props.squares[index] }
              isWinner={ this.props.winnerSquares.includes( index ) ? true : false  }
              onClick={ () => this.props.onClick( index ) }
              />;
  }

  render() {
    const boardRows = [];
    for ( let i = 0; i < 3; i++ ) {
      const row = [];
      for ( let j = 0; j < 3; j++ ) {
        row.push( this.renderSquare( 3 * i + j ) );
      }
      boardRows.push( <div key={ i } className="board-row">{ row }</div> );
    }
    return <div>{ boardRows }</div>;
  }
}

class Game extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {
      history: [{
        squares: Array( 9 ).fill( null ),
        moves: [ null, null ],
      }],
      stepNumber: 0,
      xIsNext: true,
      isAsc: true,
    }
  }

  handleClick( index ) {
    const history = this.state.history.slice( 0, this.state.stepNumber + 1 );
    const current = history[history.length - 1];
    if ( current.squares[index] || calculateWinner( current.squares ) ) { return; }
    const squares = current.squares.slice();
    squares[index] = this.state.xIsNext ? 'X' : 'O';
    this.setState( { 
      history: history.concat( [{ squares: squares, moves: [ this.getMoveRow( index ), this.getMoveColumn( index ) ] }] ),
      stepNumber: this.state.stepNumber + 1,
      xIsNext: !this.state.xIsNext 
    } );
  }

  jumpTo( step ) {
    if ( step !== this.state.stepNumber ) {
      this.setState( {
        stepNumber: step,
        xIsNext: step % 2 === 0,
      } );
    }
  }

  getMoveRow( index ) {
    if ( index > 5 ) {
      return 3
    } else if ( index > 2 ) {
      return 2
    } else {
      return 1
    }
  }

  getMoveColumn( index ) {
    switch( index % 3 ) {
      case 0: return 1;
      case 1: return 2;
      case 2: return 3;
      default: return null;
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber]
    const winner  = calculateWinner( current.squares )

    const moves = history.map( ( step, move ) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const location = move ?
        <span>( { history[move].moves[0] }, { history[move].moves[1] } )</span> : '';
      const active = move === this.state.stepNumber ? 'active' : '';
      return (
        <li key={ move }>
          <button className={ active } onClick={ () => this.jumpTo( move ) }>{ desc }</button>
          { location }
        </li>
      );
    });

    if ( ! this.state.isAsc ) moves.reverse();

    let status;
    if ( winner ) {
      status = 'Winner: ' + winner[0]
    } else if ( ! current.squares.includes( null ) ) {
      status = 'Draw'
    } else {
      status = 'Next player: ' + ( this.state.xIsNext ? 'X' : 'O' )
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={ current.squares }
            winnerSquares={ winner ? winner[1] : [] }
            onClick={ ( index ) => this.handleClick( index ) }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
          <button onClick={ () => this.setState( { isAsc: ! this.state.isAsc } ) }>Change order</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner( squares ) {
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
  for ( let i = 0; i < lines.length; i++ ) {
    const [a, b, c] = lines[i];
    // note that we 1st checked for emptiness
    if ( squares[a] && squares[a] === squares[b] && squares[a] === squares[c] ) {
      return [ squares[a], lines[i] ];
    }
  }
  return null;
}
