import React from "react";
import Header from "../Header";
import { Footer } from "../Footer/Footer";
import Head from "next/head";
import { Main } from "../UtilComponents";

import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

const AppContainer = styled.div`
  width: 100vw;
  min-width: 100%;
  max-width: 100%;
  height: 100vh;
`;

const Layout = (props) => {
  const { children, headerContent, footerContent } = props;
  return (
    <AppContainer>
      <GlobalStyle />
      <Head>
        <title>coding_in_english</title>
      </Head>
      <Header headerContent={headerContent} />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Main pb="5">{children}</Main>
      </div>
      <Footer footerContent={footerContent} />
    </AppContainer>
  );
};
export default Layout;
