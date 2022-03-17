import React, { Component } from 'react'
import Case from './Case';

export default class Board extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
       
    }
  }
  render() {
    return (
      <div>
        {this.props.playerBoard !== undefined ? 
          this.props.playerBoard.map(row => {
            return(
              <div className="mine-row">
                {row.map(c => <Case value={c.value} isBomb={c.isBomb} onClick={this.props.clickCase}/>)}
              </div>
            )
          })
        :""}
      </div>
    )
  }
}
