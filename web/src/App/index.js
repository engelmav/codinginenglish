import React, { Component } from 'react';
import './styles.css';
import { Router } from 'react-router-dom';
import styled from 'styled-components';
import history from '../history';
import Header from '../Header';
import Routes from '../Routes';

import { observer } from 'mobx-react';
import { auth } from '../auth/Auth';
import { appStore } from '../stores/AppStore';
import axios from 'axios';


const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff3e00;
  text-align: center;
  color: white;
  height: 200px;
}
`;

axios.get("https://api.ipdata.co?api-key=test").then(
  res => console.log(res.data)
);


@observer
class App extends Component {
  render() {
    return (
      <Router history={history}>
          <Header auth={auth} appStore={appStore} />
          <Routes auth={auth} appStore={appStore}/>
          <Footer><i>Made with love in Encinitas, California.</i></Footer>
      </Router>
    );
  }
}

export default App;