import React, { Component } from 'react';
import './App.css';
import { HashRouter, Route } from 'react-router-dom';
import Login from './components/Login/login';
import Private from './components/Private/Private';


class App extends Component {
  render() {
    return (
      <div className="App">
       <HashRouter>
         <div>
           <Route path='/' exact component={ Login } />
           <Route path='/private' component={ Private } />
         </div>
       </HashRouter>
      </div>
    );
  }
}

export default App;
