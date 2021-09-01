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
  const { children, headerContent, footerContent } = props;
  return (
    <div style={{height: "100vh", display: "flex", flexDirection: "column"}}>
      <GlobalStyle />
      <Head>
        <title>coding_in_english</title>
      </Head>
      <Header headerContent={headerContent} />
      <div style={{width: "100%", display: "flex", justifyContent: "center", flex: 1}}>
      <Main>
      {children}
      </Main>
      </div>
      <Footer footerContent={footerContent} />
    </div>
  );
};
export default Layout;
