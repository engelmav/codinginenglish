// This file is required to use @next/mdx in the `app` directory.

import { H2 } from "./components/typography";

const Table = ({ children }) => (
  <table style={{ border: "2px solid black", minWidth: "800px" }}>
    {children}
  </table>
);
const Td = ({ children }) => (
  <td style={{ border: "2px solid black", minWidth: "30%" }}>{children}</td>
);

export function useMDXComponents(components) {
  return {
    h1: ({ children }) => (
      <h1
        style={{
          fontSize: "40px",
          fontWeight: 900,
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 900,
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        {children}
      </h2>
    ),
    table: ({ children }) => (
      <table style={{ border: "2px solid black", minWidth: "800px" }}>
        {children}
      </table>
    ),
    blockquote: ({ children }) => (
      <p
        style={{
          paddingLeft: "20px",
          marginBottom: "20px",
          fontStyle: "italic",
        }}
      >
        {children}
      </p>
    ),
    td: ({ children }) => (
      <td style={{ border: "2px solid black", minWidth: "30%" }}>{children}</td>
    ),
    hr: ({ children }) => (
      <hr
        style={{
          margin: "auto",
          marginTop: "30px",
          marginBottom: "30px",
          width: "40%",
        }}
      />
    ),
    a: ({ href, children, ...rest }) => (
      <a
        href={href}
        target="_blank"
        style={{
          textDecoration: "underline solid",
          textDecorationThickness: "4px",
          cursor: "pointer",
          color: "orange",
          fontWeight: "900",
        }}
      >
        {children}
      </a>
    ),
    li: ({ children }) => (
      <li
        style={{
          "::before": {
            content: "*",
            position: "absolute",
            top: "6px",
            left: 0,
          },
          listStyleType: "square",
        }}
      >
        {children}
      </li>
    ),
    ul: ({ children }) => (
      <ul style={{ position: "relative", padding: "3px 0 2px 25px" }}>
        {children}
      </ul>
    ),
    p: ({ children }) => (
      <p
        style={{
          paddingBottom: "4px"
        }}
      >
        {children}
      </p>
    ),

    ...components,
  };
}
