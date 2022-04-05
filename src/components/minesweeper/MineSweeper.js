import React, { Component } from 'react';
import './style.css';

export default class MineSweeper extends Component {

  constructor(props) {
    super(props)

    this.state = {
      timer: 0,
      start: false,
      gameOver: false,
      victory: false,
      longueur: 16,
      largeur: 16,
      nbMines: 40,
      nbFlags: 0,
      gameBoard: [],
    }
  }

  initBoard = async (x,y) => {
    //Creation des tableaux vides
    let tempBoard = [];
    let nbMine = this.state.nbMines;
    if(nbMine > this.state.longueur*this.state.largeur){
      nbMine = (this.state.longueur*this.state.largeur)-10;
    }
    for (let i = 0; i < this.state.largeur; i++) {
      let row = []
      for (let j = 0; j < this.state.longueur; j++) {
        row.push({ isFlag: false, isBomb: false, value: 0, isShow: false, x: i, y: j });
      }
      tempBoard.push(row)
    }
    //Creation des mines
    let positionMine = [];
    for (let m = 0; m < nbMine; m++) {
      let pos = this.randomisePosition(this.state.largeur, this.state.longueur, x, y)
      while (positionMine.find(p => p.x === pos.x && p.y === pos.y) !== undefined) {
        pos = this.randomisePosition(this.state.largeur, this.state.longueur, x, y)
      }
      positionMine.push(pos);
    }
    //Positionnement des mines
    positionMine.forEach(pos => {
      tempBoard[pos.x][pos.y].isBomb = true;
      for (let i = pos.x - 1; i < pos.x + 2; i++) {
        for (let j = pos.y - 1; j < pos.y + 2; j++) {
          if (tempBoard[i] != undefined && tempBoard[i][j] != undefined) {
            tempBoard[i][j].value++;
          }
        }
      }
    });
    //Creation des valeurs des cases
    const nbCases = this.state.longueur*this.state.largeur;
    this.setState({
      start: true,
      gameOver: false,
      gameBoard: tempBoard,
      timer: 0,
      nbFlags:0,
      nbCases: nbCases
    },()=>{
      this.clickCase(x,y)
      const timerInterval = setInterval(()=>{
        this.setState({timer : this.state.timer +1 })
        if(this.state.gameOver || this.state.victory){
          clearInterval(timerInterval);
        }
      },1000)
    });
  }

  randomisePosition = (x, y, xStart, yStart) => {
      let newX = Math.floor(Math.random() * x);
      let newY = Math.floor(Math.random() * y);
      while(this.plusOuMoinsUn(newX,xStart) && this.plusOuMoinsUn(newY,yStart)){
        newX = Math.floor(Math.random() * x);
        newY = Math.floor(Math.random() * y);
      }
      return({
        x: newX,
        y: newY
      })
  }

  plusOuMoinsUn = (a,b) => {
    let c = a-b;
    return (c<2 && c>-2);
  }

  flagCase = (x, y) => event => {
    event.preventDefault();
    if (!this.state.gameOver || this.state.victory) {
      let tempBoard = this.state.gameBoard;
      if (!tempBoard[x][y].isShow) {
        tempBoard[x][y].isFlag = !tempBoard[x][y].isFlag;
        let addToNbFlags = this.state.nbFlags
        if(tempBoard[x][y].isFlag){
          addToNbFlags++
        }else{
          addToNbFlags--
        }
        this.setState({ 
          gameBoard: tempBoard ,
          nbFlags: addToNbFlags
        })
      }
    }
  }

  clickCase = (x, y) => {
    if(this.state.start){
      if (!this.state.gameOver && !this.state.victory) {
        let tempBoard = this.state.gameBoard;
        if (!tempBoard[x][y].isShow) {
          tempBoard[x][y].isShow = true;
          if (tempBoard[x][y].value === 0) {
            for (let i = x - 1; i < x + 2; i++) {
              for (let j = y - 1; j < y + 2; j++) {
                if (tempBoard[i] != undefined && tempBoard[i][j] != undefined && !tempBoard[i][j].isShow) {
                  this.clickCase(i, j);
                }
              }
            }
          }
          this.setState({ gameBoard: tempBoard })
          if (tempBoard[x][y].isBomb) {
            tempBoard[x][y].explose = true;
            this.gameOver();
          } else {
            let board = this.state.gameBoard;
            let nbCase = 0;
            board.map(row => {
              row.map(c => {
                if(!c.isShow) nbCase++;
              })
            })
            if(nbCase == this.state.nbMines){
              this.setState({victory: true})
            }
          }
        } else {
          let numFlagArround = 0;
          for (let i = x - 1; i < x + 2; i++) {
            for (let j = y - 1; j < y + 2; j++) {
              if (tempBoard[i] != undefined && tempBoard[i][j] != undefined && tempBoard[i][j].isFlag) {
                numFlagArround++;
              }
            }
          }
          if (numFlagArround == tempBoard[x][y].value) {
            for (let i = x - 1; i < x + 2; i++) {
              for (let j = y - 1; j < y + 2; j++) {
                if (tempBoard[i] != undefined && tempBoard[i][j] != undefined && !tempBoard[i][j].isShow && !tempBoard[i][j].isFlag) {
                  this.clickCase(i, j);
                }
              }
            }
          }
        }
      }
    }else{
      this.initBoard(x,y);
    }
  }

  gameOver = () => {
    let tempBoard = this.state.gameBoard;
    tempBoard.map(row => {
      return (
        row.map(c => {
          if(c.isBomb && !c.isFlag && c.explose === undefined){
            c.isShow = true
          } else if(c.isFlag && !c.isBomb){
            c.wrongFlag = true
          }
          return c;
        })
      )
    })
    this.setState({ gameOver: true })
  }


  initGame = () => {
    let tempBoard = []
    for(let i = 0; i < this.state.largeur; i++){
      let row = []
      for(let j = 0; j<this.state.longueur; j ++){
        row.push({x: i, y: j});
      }
      tempBoard.push(row);
    }
    this.setState({
      victory: false,
      start: false,
      gameBoard: tempBoard
    })
  }

  onChangeInput = (type) => event => {
    switch(type){
      case "longueur":
        this.setState({longueur : event.target.value})
        break;
      case "largeur":
        this.setState({largeur : event.target.value})
        break;
      case "mine":
        if(event.target.value > (this.state.longueur*this.state.largeur)-10){
          this.setState({nbMines : (this.state.longueur*this.state.largeur)-10})
        } else {
          this.setState({nbMines : event.target.value})
        }
        break;
    }
  }

  render() {
    const width = (this.state.longueur*30)+"px";
    const heigth = (this.state.largeur*30)+"px";
    let key = 1;
    
    return (
      <div className="minesweeper">
        <header>
          <div className="mine-params">
            <div className="level">
              <h3>EASY</h3>
              <p>8x8 - 10 mines</p>
            </div>
            <div className="level">
              <h3>MEDIUM</h3>
              <p>16x16 - 40 mines</p>
            </div>
            <div className="level">
              <h3>HARD</h3>
              <p>30x16 - 99 mines</p>
            </div>
            <div className="level">
              <h3>CUSTOM</h3>
            </div>
            <div className="custom-settong">
              <label>
                Longueur du plateau : <input type="text" value={this.state.longueur} onChange={this.onChangeInput('longueur')}/>
              </label>
              <label>
                Hauteur du plateau : <input type="text" value={this.state.largeur} onChange={this.onChangeInput('largeur')} />
              </label>
              <label>
                Nombre de mine : <input type="text" value={this.state.nbMines} onChange={this.onChangeInput('mine')} />
              </label>
            </div>
          </div>
          <div className="info-game">
            <button onClick={this.initGame}>Start</button>
            <div>
              <img className="info-icon" src="flag.png"/>
              {this.state.nbFlags} / {this.state.nbMines}
            </div>
            <div>
              <img className="info-icon" src="chrono.png"/>
              {Math.floor(this.state.timer/60)} : {("0" + this.state.timer%60).slice(-2)}
            </div>
            {this.state.victory?
              <div>
                VICTOIRE !
              </div>
            : ""}
          </div>
        </header>
        
        <div className="mine-board" style={{width: width, height: heigth}}>
          {this.state.gameBoard !== undefined ?
            this.state.gameBoard.map(row => {
              return (
                <div className="mine-row" key={key++}>
                  {row.map(c => {
                    if (c.explose != undefined && c.explose) {
                      return (
                        <div className="mine-case-show-bomb" key={key++}><img className="gameIcon" src="bomb.png" /></div>
                      )
                    } else if(c.wrongFlag != undefined && c.wrongFlag){
                      return (
                        <div className="mine-case-show-bomb" key={key++}><img className="gameIcon" src="flag.png" /></div>
                      )
                    } else if(c.isShow && c.isBomb){
                      return (
                        <div className="mine-case-hide" key={key++}><img className="gameIcon" src="bomb.png" /></div>
                      )
                    } else if (c.isShow && c.value == 0) {
                      return (
                        <div className="mine-case-show" key={key++}></div>
                      )
                    } else if (c.isShow) {
                      const cssClass = "mine-case-show case-" + c.value;
                      return (
                        <div className={cssClass} key={key++} onClick={() => this.clickCase(c.x, c.y)}>{c.value}</div>
                      )
                    } else if (c.isFlag) {
                      return (
                        <div className="mine-case-hide" key={key++} onContextMenu={this.flagCase(c.x, c.y)} onClick={() => this.clickCase(c.x, c.y)}><img className="gameIcon" src="flag.png" /></div>
                      )
                    } else {
                      return (
                        <div className="mine-case-hide" key={key++} onContextMenu={this.flagCase(c.x, c.y)} onClick={() => this.clickCase(c.x, c.y)}></div>
                      )
                    }
                  })}
                </div>
              )
            })
            : ""}
        </div>
      </div>
    )
  }
}
