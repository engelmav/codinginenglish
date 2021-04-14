import React, { Component } from "react";
import "./styles.css";
import { Router } from "react-router-dom";
import styled from "styled-components";
import history from "../history";
import { observer } from "mobx-react";
import { Flex } from "rebass";
import { Box } from "../UtilComponents/Box";

const RoutesBox = styled(Box)`
  flex: 1;
`;

@observer
class App extends Component {
  render() {
    const { Header, Routes, Footer } = this.props;
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
          <Footer />
        </Flex>
      </Router>
    );
  }
}

export { App };
