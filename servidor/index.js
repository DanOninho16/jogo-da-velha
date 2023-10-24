const express = require('express');
const app = express();
const jogadas = [];

app.use(require("cors")());
app.use(express.json());

app.get('/', (req, res, next) => {
    res.json(jogadas);
})

app.post('/jogada', (req, res, next) => {
  console.log("Jogada recebida!");

  const { squares, xIsNext, winner, position } = req.body;

  if(winner){
    res.status(400).json({ error: 'O jogo ja acabou'});
    return;
  }
  if (position >= 0 && position < 9 && squares[position] === null) {
    squares[position] = xIsNext ? 'X' : 'O';
    const updatedWinner = calculateWinner(squares);
    const updatedXIsNext = !xIsNext;

    //salva no banco de dados
    jogadas.push({
      squares: squares,
      xIsNext: updatedXIsNext,
      winner: updatedWinner
    });
    res.status(200).json({
      squares: squares,
      xIsNext: updatedXIsNext,
      winner: updatedWinner
    });
  } else {
    res.status(400).json({ error: 'Jogada inválida.' });
  }
});

app.listen(3001, () => console.log("Servidor escutando na porta 3001..."));

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
      return squares[a];
    }
  }
  return null; 
}

class TicTacToeGame {
  constructor() {
    this.xIsNext = true;
    this.squares = Array(9).fill(null);
  }

  makeMove(i) {
    if (this.calculateWinner() || this.squares[i]) {
      return false;
    }

    this.squares[i] = this.xIsNext ? 'X' : 'O';
    this.xIsNext = !this.xIsNext;
    return true;
  }
}

const game = new TicTacToeGame();
app.post('/makeMove/:position', (req, res) => {
  const position = parseInt(req.params.position);
  if (game.makeMove(position)) {
    res.json({ squares: game.squares, xIsNext: game.xIsNext, winner: game.winner });
  } else {
    res.status(400).json({ error: 'Jogada inválida.' });
  }
});
