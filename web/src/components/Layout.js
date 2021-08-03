import React from "react";
// import Header from "../Header";
import { Header } from "../rootProd";
import Head from "next/head";
import styled from "styled-components";
import { createGlobalStyle, ThemeProvider } from "styled-components";


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
    </Head>
    <Header />
    {props.children}
    <div>Fake footer</div>
    </>
);

export default Layout;
