import './App.css';
import React, { Component } from 'react'
import MinesWeeper from './components/minesweeper/Index';
import Navbar from './components/Navbar';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Home from './pages';
import About from './pages/about';
import Jeux from './pages/jeux';
import SignUp from './pages/sign-up';
import SignIn from './pages/sign-in';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <Navbar />
      <Routes>
      <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/jeux' element={<Jeux />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/sign-in' element={<SignIn />} />
      </Routes>
    </BrowserRouter>
    )
  }
}