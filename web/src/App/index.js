import React, { Component } from 'react';
import './styles.css';
import { Router } from 'react-router-dom';
import styled from 'styled-components';
import history from '../history';
import { observer } from 'mobx-react';

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

// Dear Vin, there appears to be a circular reference between this module and rootProd.

// axios.get("https://api.ipdata.co?api-key=test").then(
//   res => console.log(res.data)
// );


@observer
class App extends Component {
  render() {
    const {
      appStore,
      auth,
      Header,
      Routes
    } = this.props;
    return (
      <Router history={history}>
        <Header />
        <Routes />
        <Footer><i>Made with love in Encinitas, California.</i></Footer>
      </Router>
    );
  }
}

export { App };