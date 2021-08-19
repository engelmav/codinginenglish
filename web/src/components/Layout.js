import React from "react";
import Header from "../Header";
import { Footer } from "../Footer/Footer";
import Head from "next/head";

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

const Layout = (props) => (
  <>
    <GlobalStyle />
    <Head>
      <title>coding_in_english</title>
      <link
        href="https://fonts.googleapis.com/css?family=Roboto+Mono&display"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Noto+Sans&display"
        rel="stylesheet"
      />
    </Head>
    <Header />
    {props.children}
    <Footer />
  </>
);

export default Layout;
