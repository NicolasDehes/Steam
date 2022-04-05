import './App.css';
import React, { Component } from 'react'
import MineSweeper from './components/minesweeper/MineSweeper';

export default class App extends Component {
  render() {
    return (
      <div>
        <MineSweeper/>
      </div>
    )
  }
}