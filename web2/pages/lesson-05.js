import React from "react";
import { H1, H2 as H2Base, P } from "../components/typography";
import tw, { styled } from "twin.macro";
import { MDXProvider } from '@mdx-js/react'
import MyMDXPage from './my-mdx-page.mdx'


const Table = ({ children }) => <table style={{ border: "2px solid black", minWidth: "800px" }}>{children}</table>
const Td = ({ children }) => <td style={{ border: "2px solid black", minWidth: "20%" }}>{children}</td>



const components = {
  table: Table,
  td: Td,
  h1: H1
}


export default function About() {
  return (
    <div style={{ padding: "60px" }}><MDXProvider
      components={components}
    >


      <MyMDXPage />

    </MDXProvider > </div>
  );
}
