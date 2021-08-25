import React from "react";
import Header from "../Header";
import { Footer } from "../Footer/Footer";
import Head from "next/head";
import { Main } from "../UtilComponents"

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

const Layout = (props) => {
  const { children, headerContent } = props;
  return (
    <div style={{height: "100vh", display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
      <GlobalStyle />
      <Head>
        <title>coding_in_english</title>
      </Head>
      <Header headerContent={headerContent} />
      <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
      <Main>
      {children}
      </Main>
      </div>
      <Footer headerContent={headerContent} />
    </div>
  );
};
export default Layout;
