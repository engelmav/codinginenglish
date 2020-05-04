import React, { Component } from 'react';
import './styles.css';
import { Router } from 'react-router-dom';
import history from '../history';
import Header from '../Header';
import Routes from '../Routes';

import { observer } from 'mobx-react';
import { auth } from '../auth/Auth';
import { appStore } from '../stores/AppStore';


@observer
class App extends Component {
  render() {
    return (
      <Router history={history}>
          <Header auth={auth} appStore={appStore} />
          <Routes auth={auth} appStore={appStore}/>
          <footer><i>Made with love in Encinitas, California.</i></footer>
      </Router>
    );
  }
}

export default App;