import React, { Component } from 'react'

export default class MinesWeeper extends Component {
  
  constructor(props) {
    super(props)
  
    this.state = {
      longueur: 16,
      largeur: 16,
      nbMines: 40,
      gameBoard: [],
      playerBoard: [],
    }
  }

  initBoard = async() => {
    let tempBoard = [];
    for(let i = 0; i < this.state.longueur; i++){
      let row = []
      for(let j = 0; j<this.state.largeur;j++){
        row.push(0);
      }
      tempBoard.push(row)
    }
    this.setState({
      gameBoard: tempBoard,
      playerBoard: tempBoard
    });
  }

  

  initGame = async() => {
    await initBoard();
    
  }

  render() {
    return (
      <div className="minesweeper">
        <div className="mine-params">
          <div>
            Longueur : <input type="text" value={this.state.longueur}/>
          </div>
          <div>
            Largeur : <input type="text" value={this.state.largeur}/>
          </div>
          <div>
            Nombre de mine : <input type="text" value={this.state.nbMines}/>
          </div>
          <button>Start</button>
        </div>
      </div>
    )
  }
}
