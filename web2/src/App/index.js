import React, { Component } from "react";

import styled from "styled-components";
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

class App extends Component {
  componentDidMount() {
    ["loader-container", "loader-style"].map((elemId) => {
      const el = document.getElementById(elemId);
      if (el) el.remove();
    });
  }
  render() {
    const { Header, Routes, Footer } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />

        <RoutesBox>
          <Routes />
        </RoutesBox>
      </ThemeProvider>
    );
  }
}

export { App };
