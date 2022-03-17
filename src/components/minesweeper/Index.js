import React, { Component } from 'react'
import Board from './Board';

export default class MinesWeeper extends Component {
  
  constructor(props) {
    super(props)
  
    this.state = {
      longueur: 16,
      largeur: 16,
      nbMines: 40,
      gameBoard: [],
    }
  }

  initBoard = async() => {
    //Creation des tableaux vides
    let tempBoard = [];
    for(let i = 0; i < this.state.longueur; i++){
      let row = []
      for(let j = 0; j<this.state.largeur;j++){
        row.push({isBomb: false, value: 0});
      }
      tempBoard.push(row)
    }
    //Creation des mines
    let positionMine = [];
    for(let m = 0;m <this.state.nbMines; m++){
      let pos = this.randomisePosition(this.state.longueur,this.state.largeur)
      while(positionMine.find(p => p.x === pos.x && p.y === pos.y)!==undefined){
        pos = this.randomisePosition(this.state.longueur,this.state.largeur)
      }
      positionMine.push(pos);
    }
    //Positionnement des mines
    positionMine.forEach(pos => {
      tempBoard[pos.x][pos.y] = {isBomb: true}  
    });
    //Creation des valeurs des cases
    for(let i = 0; i < this.state.longueur; i++){
      let row = []
      for(let j = 0; j<this.state.largeur;j++){
        row.push({isBomb: false, value: 0});
      }
      tempBoard.push(row)
    }

    this.setState({
      gameBoard: tempBoard
    });
  }

  randomisePosition = (x,y) => {
    return {
      x: Math.floor(Math.random()*x),
      y: Math.floor(Math.random()*y)
    };
  }

  clickCase = () => {

  }

  gameOver = () => {

  }
  

  initGame = async() => {
    await this.initBoard();
    
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
          <button onClick={this.initGame}>Start</button>
        </div>
        <Board clickCase={this.clickCase} gameOver={this.gameOver} playerBoard={this.state.playerBoard}/>
      </div>
    )
  }
}
