import React, { Component } from 'react'

export default class Clicker extends React.Component {

  constructor(props){
    super(props);

    this.state ={
      count: 0,
      max_score: 10
    }

    this.handleIncrement = this.handleIncrement.bind(this);
        
  }

  handleIncrement(){
    this.setState((prev) => ({ count: prev.count + 1 }));

    if (this.state.count == this.state.max_score - 1) {
      this.setState({ count: 0 });
    }
  }

  render() {
    return (
      <div style={{width: "100%", height: "100%", backgroundColor: "grey", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <div  style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
          <div style={{display: 'flex',  justifyContent:'center'}}>
            <button onClick={this.handleIncrement} style={{width: "200px", height: "50px", backgroundColor: "green"}}>Frapper</button>
          </div>
        </div> 
        <div>
          <div style={{position: 'absolute', width: '100%', height: '100px', bottom: '0px', backgroundColor: 'white', justifyContent: 'center', textAlign: 'center' }}> {this.state.count} / {this.state.max_score}</div>
        </div>
      </div>
      
    )
  }
}
