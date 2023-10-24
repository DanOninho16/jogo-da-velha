import './App.css';
import axios from 'axios';
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [xIsNext, setXISNext] = useState(true);
  const [status, setStatus] = useState('');

  function handleClick(i) {
    axios.post('http://localhost:3001/jogada', {
      squares: squares,
      xIsNext: xIsNext,
      winner: winner,
      position: i,
    }).then(response => {
      setSquares(response.data.squares);
      setXISNext(response.data.xIsNext);
      setWinner(response.data.winner);
    }).catch(error => {
      console.error('Erro na solicitação:', error); 
    });
  }

  let newStatus;
  if (winner) {
    newStatus = 'Winner: ' + winner;
  } else {
    newStatus = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{newStatus}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}