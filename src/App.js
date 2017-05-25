import React, { Component } from 'react';
import './App.css';
import Search from './Search.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container App-container">
          <Search />
        </div>
      </div>
    );
  }
}

export default App;

// <div className="App-header">
//   <img src={logo} className="App-logo" alt="logo" />
//   <h2>Welcome to React</h2>
// </div>