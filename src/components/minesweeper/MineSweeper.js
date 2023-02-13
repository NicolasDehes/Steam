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
      longueur: 8,
      largeur: 8,
      nbMines: 10,
      nbFlags: 0,
      gameBoard: [],
      openSetting: false,
      openLevel: true,
      openInfoGame: false,
    }
  }

  initBoard = async (x, y) => {
    //Creation des tableaux vides
    let tempBoard = [];
    let nbMine = this.state.nbMines;
    if (nbMine > this.state.longueur * this.state.largeur) {
      nbMine = (this.state.longueur * this.state.largeur) - 10;
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
      let pos = this.randomisePosition(this.state.largeur, this.state.longueur, x, y) // eslint-disable-next-line
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
          if (tempBoard[i] !== undefined && tempBoard[i][j] !== undefined) {
            tempBoard[i][j].value++;
          }
        }
      }
    });
    //Creation des valeurs des cases
    const nbCases = this.state.longueur * this.state.largeur;
    this.setState({
      start: true,
      gameBoard: tempBoard,
      timer: 0,
      nbFlags: 0,
      nbCases: nbCases
    }, () => {
      this.clickCase(x, y)
      const timerInterval = setInterval(() => {
        this.setState({ timer: this.state.timer + 1 })
        if (this.state.gameOver || this.state.victory || !this.state.start) {
          clearInterval(timerInterval);
        }
        if (!this.state.start) {
          this.setState({ timer: 0 })
        }
      }, 1000)
    });
  }

  randomisePosition = (x, y, xStart, yStart) => {
    let newX = Math.floor(Math.random() * x);
    let newY = Math.floor(Math.random() * y);
    while (this.plusOuMoinsUn(newX, xStart) && this.plusOuMoinsUn(newY, yStart)) {
      newX = Math.floor(Math.random() * x);
      newY = Math.floor(Math.random() * y);
    }
    return ({
      x: newX,
      y: newY
    })
  }

  plusOuMoinsUn = (a, b) => {
    let c = a - b;
    return (c < 2 && c > -2);
  }

  flagCase = (x, y) => event => {
    event.preventDefault();
    if (!this.state.gameOver || this.state.victory) {
      let tempBoard = this.state.gameBoard;
      if (!tempBoard[x][y].isShow) {
        tempBoard[x][y].isFlag = !tempBoard[x][y].isFlag;
        let addToNbFlags = this.state.nbFlags
        if (tempBoard[x][y].isFlag) {
          addToNbFlags++
        } else {
          addToNbFlags--
        }
        this.setState({
          gameBoard: tempBoard,
          nbFlags: addToNbFlags
        })
      }
    }
  }

  clickCase = (x, y) => {
    if (this.state.start) {
      if (!this.state.gameOver && !this.state.victory) {
        let tempBoard = this.state.gameBoard;
        if (!tempBoard[x][y].isShow && !tempBoard[x][y].isFlag) {
          tempBoard[x][y].isShow = true;
          if (tempBoard[x][y].value === 0) {
            for (let i = x - 1; i < x + 2; i++) {
              for (let j = y - 1; j < y + 2; j++) {
                if (tempBoard[i] !== undefined && tempBoard[i][j] !== undefined && !tempBoard[i][j].isShow) {
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
            let nbCase = 0;
            tempBoard.forEach(row => {
              row.forEach(c => {
                if (!c.isShow) nbCase++;
              })
            })
            if (nbCase === this.state.nbMines) {
              this.setState({ victory: true })
            }
          }
        } else if (!tempBoard[x][y].isFlag) {
          let numFlagArround = 0;
          for (let i = x - 1; i < x + 2; i++) {
            for (let j = y - 1; j < y + 2; j++) {
              if (tempBoard[i] !== undefined && tempBoard[i][j] !== undefined && tempBoard[i][j].isFlag) {
                numFlagArround++;
              }
            }
          }
          if (numFlagArround === tempBoard[x][y].value) {
            for (let i = x - 1; i < x + 2; i++) {
              for (let j = y - 1; j < y + 2; j++) {
                if (tempBoard[i] !== undefined && tempBoard[i][j] !== undefined && !tempBoard[i][j].isShow && !tempBoard[i][j].isFlag) {
                  this.clickCase(i, j);
                }
              }
            }
          }
        }
      }
    } else {
      this.initBoard(x, y);
    }
  }

  gameOver = () => {
    let tempBoard = this.state.gameBoard;
    tempBoard.map(row => {
      return (
        row.map(c => {
          if (c.isBomb && !c.isFlag && c.explose === undefined) {
            c.isShow = true
          } else if (c.isFlag && !c.isBomb) {
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
    for (let i = 0; i < this.state.largeur; i++) {
      let row = []
      for (let j = 0; j < this.state.longueur; j++) {
        row.push({ x: i, y: j });
      }
      tempBoard.push(row);
    }
    this.setState({
      victory: false,
      start: false,
      gameBoard: tempBoard,
      gameOver: false,
      openSetting: false,
      openInfoGame: true,
      nbFlags: 0,
    })
  }

  onChangeInput = (type) => event => {
    switch (type) {
      case "longueur":
        this.setState({ longueur: event.target.value })
        break;
      case "largeur":
        this.setState({ largeur: event.target.value })
        break;
      case "mine":
        if (event.target.value > (this.state.longueur * this.state.largeur) - 10) {
          this.setState({ nbMines: (this.state.longueur * this.state.largeur) - 10 })
        } else {
          this.setState({ nbMines: event.target.value })
        }
        break;
      default:
        break;
    }
  }
  launchLevel = (type) => event => {
    this.setState({ openLevel: false })
    switch (type) {
      case "easy":
        this.setState({
          longueur: 8,
          largeur: 8,
          nbMines: 10,
          openInfoGame: true
        })
        break;
      case "normal":
        this.setState({
          longueur: 16,
          largeur: 16,
          nbMines: 40,
          openInfoGame: true
        })
        break;
      case "hard":
        this.setState({
          longueur: 30,
          largeur: 16,
          nbMines: 99,
          openInfoGame: true
        })
        break;
      case "custom":
        this.setState({
          longueur: 10,
          largeur: 10,
          nbMines: 10,
          openSetting: true
        })
        break;
      default:
        break;
    }
  }
  changeLevel = () => {
    this.setState({
      openInfoGame: false,
      openLevel: true,
      openSetting: false,
      longueur: 0,
      largeur: 0,
      gameBoard: [],
      victory: false,
      gameOver: false
    })
  }

  logic = (originX, originY) => {
    for (let x = originX - 1; x < originX + 2; x++) {
      if (x > 0 && x < this.state.gameBoard.length) {
        // COLONE
        for (let y = originY - 1; y < originY + 2; y++) {
          if (y > 0 && y < this.state.gameBoard[x].length) {
            // Sur une case autour de celle recherchée
            const c = this.state.gameBoard[x][y];
            if (c.isShow && c.value > 0) {
              let count = 0;
              // On compte le nombre de case grise autour d'elle
              // LIGNE
              for (let xx = x - 1; xx < x + 2; xx++) {
                if (xx >= 0 && xx < this.state.gameBoard.length) {
                  // COLONE
                  for (let yy = y - 1; yy < y + 2; yy++) {
                    if (yy >= 0 && yy < this.state.gameBoard[xx].length) {
                      // Sur une case autour de celle recherchée
                      const cc = this.state.gameBoard[xx][yy];
                      if (!cc.isShow || cc.isFlag) {
                        count++;
                      }
                    }
                  }
                }
              }
              // Si le nombre de case grise est bien le nombre indiqué sur la case
              if (count === c.value) {
                return "!"
              }
            }
          }
        }
      }
    }
    return null;
  }

  autoPlay = () => async(event) => {
    event.preventDefault();
    console.log("Youhou !")
    while(!this.state.victory){
      this.state.gameBoard.forEach(row => {
        row.forEach(c => {
          if(c.isFlag != true){
            if(this.logic(c.x,c.y)==="!"){
              this.flagCase(c.x,c.y)(event);
            }
          }
        })
      });
      await this.sleep(10);
      this.state.gameBoard.forEach(row => {
        row.forEach(c => {
          if(c.isShow){
            this.clickCase(c.x,c.y)
          }
        })
      });
      await this.sleep(10);
    }
  }
  sleep = (ms) =>  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  render() {
    const width = (this.state.longueur * 34) + "px";
    const heigth = ((this.state.largeur * 34) + 34) + "px";
    let key = 1;

    return (
      <div className="minesweeper">
        <header>
          <h1 className="title">MINESWEEPER</h1>
          <div className="mine-params">
            <div className={this.state.openLevel ? "allLevel" : "displayNone"}>
              <div className="level" onClick={this.launchLevel("easy")}>
                <span className="level-title">EASY</span>
                <p>8x8 - 10 mines</p>
              </div>
              <div className="level" onClick={this.launchLevel("normal")}>
                <span className="level-title">MEDIUM</span>
                <p>16x16 - 40 mines</p>
              </div>
              <div className="level" onClick={this.launchLevel("hard")}>
                <span className="level-title">HARD</span>
                <p>30x16 - 99 mines</p>
              </div>
              <div className="level" onClick={this.launchLevel("custom")}>
                <span className="level-title">CUSTOM</span>
                <p>???</p>
              </div>
            </div>
            <div className={this.state.openSetting ? "custom-setting" : "displayNone"}>
              <label>
                Longueur du plateau : <input type="text" value={this.state.longueur} onChange={this.onChangeInput('longueur')} />
              </label><br />
              <label>
                Hauteur du plateau : <input type="text" value={this.state.largeur} onChange={this.onChangeInput('largeur')} />
              </label><br />
              <label>
                Nombre de mine : <input type="text" value={this.state.nbMines} onChange={this.onChangeInput('mine')} />
              </label><br />
              <button className="button" onClick={this.initGame}>Start</button>
            </div>
          </div>
          <div className={this.state.openInfoGame ? "info-game" : "displayNone"}>
            <div>
              <img className="info-icon" src="flag.png" alt="flag" />
              {this.state.nbFlags} / {this.state.nbMines}
            </div>
            <div>
              <button className="button" onClick={this.initGame}>Start</button>
            </div>
            <div>
              <img className="info-icon" src="chrono.png" alt="chrono" />
              {Math.floor(this.state.timer / 60)} : {("0" + this.state.timer % 60).slice(-2)}
            </div>
            <div>
              <button className="button" onClick={this.changeLevel}>Changer la difficulté</button>
            </div>
            <div>
              <button className='button' onClick={this.autoPlay()}>AutoPlay</button>
            </div>
          </div>
        </header>
        <div className="victory">
          {this.state.victory ?
            "VICTOIRE !"
            : this.state.gameOver ?
              "PERDU !"
              : ""}
        </div>
        <div className="mine-board" style={{ width: width, height: heigth }}>
          {this.state.gameBoard !== undefined ?
            this.state.gameBoard.map(row => {

              return (
                <div className="mine-row" key={key++}>
                  {row.map(c => {
                    // c.logic = this.logic(c.x,c.y);
                    return (
                      <div className="mine-case" style={{ width: this.state.longueur / width, height: this.state.largeur / heigth }}>
                        {(c.explose !== undefined && c.explose) ?
                          <div className="mine-case-show-bomb" key={key++}><img className="gameIcon" src="bomb.png" alt="bomb" /></div>
                          : (c.wrongFlag !== undefined && c.wrongFlag) ?
                            <div className="mine-case-show-bomb" key={key++}><img className="gameIcon" src="flag.png" alt="flag" /></div>
                            : (c.isShow && c.isBomb) ?
                              <div className="mine-case-hide" key={key++}><img className="gameIcon" src="bomb.png" alt="bomb" /></div>
                              : (c.isShow && c.value === 0) ?
                                <div className="mine-case-show" key={key++}></div>
                                : (c.isShow) ?
                                  <div className={"mine-case-show case-" + c.value} key={key++} onClick={() => this.clickCase(c.x, c.y)}>{c.value}</div>
                                  : (c.isFlag) ?
                                    <div className="mine-case-hide" key={key++} onContextMenu={this.flagCase(c.x, c.y)} onClick={() => this.clickCase(c.x, c.y)}><img className="gameIcon" src="flag.png" alt="flag" /></div>
                                    :
                                    <div className="mine-case-hide" key={key++} onContextMenu={this.flagCase(c.x, c.y)} onClick={() => this.clickCase(c.x, c.y)}>{c.logic}</div>
                        }
                      </div>
                    )
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
