import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import Navbar from './components/navbar/Navbar.js';
import Game from './components/Game.js';
import About from './components/About.js';
import CreateAccount from './components/CreateAccount';
import CharacterSelect from './components/game_route/CharacterSelectPage.js';



function App() {

  return (
    <Router>
    <div>
      <Navbar />
      <Route exact path="/" component={Game}/>
      <Route exact path="/about" component={About} />
      <Route exact path="/create-account" component={CreateAccount} />
      <Route exact path="/character-select" component={CharacterSelect} />
      {/* <Route exact path="/load-game" component={load game ...} /> */}
    </div>
  </Router>
  );
}


export default App;
