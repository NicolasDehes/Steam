import React, { Component } from 'react';
import './style.css';

export default class MinesWeeper extends Component {
  
  constructor(props) {
    super(props)
  
    this.state = {
      longueur: 16,
      largeur: 16,
      nbMines: 30,
      gameBoard: [],
    }
  }

  initBoard = async() => {
    //Creation des tableaux vides
    let tempBoard = [];
    for(let i = 0; i < this.state.longueur; i++){
      let row = []
      for(let j = 0; j<this.state.largeur;j++){
        row.push({isBomb: false, value: 0, isShow: false,x: i,y: j});
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
      tempBoard[pos.x][pos.y].isBomb = true;
      for(let i = pos.x -1 ; i < pos.x +2 ; i++){
        for(let j = pos.y -1 ; j < pos.y +2 ; j++){
          if(tempBoard[i]!= undefined && tempBoard[i][j] != undefined){
            tempBoard[i][j].value++;
          }
        }
      }
    });
    //Creation des valeurs des cases
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

  howManyBombArround = (x,y) => {

  }

  clickCase = (x,y) => {
    let tempBoard = this.state.gameBoard;
    tempBoard[x][y].isShow = true;
    if(tempBoard[x][y].value === 0){
      for(let i = x -1 ; i < x +2 ; i++){
        for(let j = y -1 ; j < y +2 ; j++){
          if(tempBoard[i]!= undefined && tempBoard[i][j] != undefined && !tempBoard[i][j].isShow){
            this.clickCase(i,j);
          }
        }
      }
    }
    this.setState({gameBoard: tempBoard})
    if(tempBoard[x][y].isBomb){
      this.gameOver();
    }
  }

  gameOver = () => {
    console.log("AHAH Loser")
  }
  

  initGame = async() => {
    await this.initBoard();
    
  }

  render() {
    let key = 1;
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
        <div className="mine-board">
        {this.state.gameBoard !== undefined ? 
          this.state.gameBoard.map(row => {
            return(
              <div className="mine-row" key={key++}>
                {row.map(c => {
                  if(c.isShow){
                    return (
                      <div className="mine-case-show" key={key++}>{c.isBomb?"X":c.value}</div>
                    )
                  }else{
                    return (
                      <div className="mine-case-hide" key={key++} onClick={() => this.clickCase(c.x,c.y)}></div>
                    )
                  }
                })}
              </div>
            )
          })
        :""}
        </div>
      </div>
    )
  }
}
