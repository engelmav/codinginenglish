import React, { Component } from "react";
import "./styles.css";
import { Router } from "react-router-dom";
import styled from "styled-components";
import history from "../history";
import { observer } from "mobx-react";
import { Flex } from "rebass";
import { Box } from "../UtilComponents/Box";

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff3e00;
  text-align: center;
  color: white;
  padding: 10px;
}
`;

const RoutesBox = styled(Box)`
  flex: 1;
`;

@observer
class App extends Component {
  render() {
    const { appStore, auth, Header, Routes } = this.props;
    return (
      <Router history={history}>
        <Flex
          justifyContent="space-between"
          flexDirection="column"
          height="100%"
        >
          <Header />
          <RoutesBox>
            <Routes />
          </RoutesBox>
          <Footer>
            <i>Made with love in Encinitas, California.</i>
          </Footer>
        </Flex>
      </Router>
    );
  }
}

export { App };
