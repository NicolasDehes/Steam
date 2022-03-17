import './App.css';
import React, { Component } from 'react'
import MinesWeeper from './components/minesweeper/Index';

export default class App extends Component {
  render() {
    return (
      <div>
        <MinesWeeper/>
      </div>
    )
  }
}