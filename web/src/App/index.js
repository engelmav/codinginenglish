import React, { Component, Suspense } from "react";
import "./styles.css";
import { Router } from "react-router-dom";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Flex } from "rebass";
import { Box } from "../UtilComponents/Box";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { Spinner } from "../UtilComponents";


const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

const theme = {
  colors: {
    cieOrange: "#ff3e00",
  },
};

const RoutesBox = styled(Box)`
  flex: 1;
`;


@observer
class App extends Component {
  render() {
    const { Header, Routes, Footer, history } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Suspense fallback={<Spinner color="black" alignSelf="center" />}>
          <Router history={history}>
            <GlobalStyle />
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
        </Suspense>
      </ThemeProvider>
    );
  }
}

export { App };
