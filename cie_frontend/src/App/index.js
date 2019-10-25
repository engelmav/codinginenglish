import React, { Component } from 'react';
import './styles.css';
import { Router } from 'react-router-dom';
import history from '../history';
import Header from '../Header';
import Routes from '../Routes';

import { auth } from '../auth/Auth';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      authData: null,
    };
  }


  setIsAuthenticated = (authData) => {
    console.log("authData from setIsAuthenticated:", authData);
    this.setState(
      {
        isAuthenticated: true,
        authData
      }
    );
  }

  render() {
    const { state: { authData } } = this;
    return (
      <Router history={history}>
        <>
          <Header authData={authData} auth={auth} shrinkNav={this.shrinkNav} />
          <Routes authData={authData} setIsAuthenticated={this.setIsAuthenticated} auth={auth} />
        </>
      </Router>
    );
  }
}

export default App;