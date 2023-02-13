import './App.css';
import React, { Component } from 'react'
import MineSweeper from './components/minesweeper/MineSweeper';
import Clicker from './components/clicker/Index';

export default class App extends Component {
  render() {
    return (
      <div>
        <MineSweeper/>
      </div>
    )
  }
}