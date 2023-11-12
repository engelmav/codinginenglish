"use client";
import React, { useState } from "react";
import { GoogleDoc } from "../components/GoogleDoc"

import { MDXProvider } from "@mdx-js/react";
import MyMDXPage from "./my-mdx-page.mdx";

export default function About() {
  return (
    <div style={{ padding: "60px" }}>
      <FloatingModal />
      <MDXProvider>
        <MyMDXPage />
      </MDXProvider>{" "}
    </div>
  );
}

const FloatingModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "600px",
    height: "100%",
    background: "white",
    boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.5)",
    transform: isOpen ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s ease",
  };

  const tabStyle = {
    position: "fixed",
    top: "50%",
    left: 0,
    width: "30px",
    height: "100px",
    background: "grey",
    writingMode: "vertical-rl",
    textAlign: "center",
    transform: isOpen ? "translateX(-100%) translateX(30px)" : "translateX(0)",
    transition: "transform 0.3s ease",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const closeBtnStyle = {
    display: "block",
    margin: "10px",
    padding: "5px 10px",
  };

  return (
    <div>
      {/* Thin tab or icon that opens the modal */}
      <div style={tabStyle} onClick={() => setIsOpen(true)}>
        <span>Notes</span>
      </div>

      {/* Modal content */}
      <div style={modalStyle}>
        {isOpen && (
          <>
            <button style={closeBtnStyle} onClick={() => setIsOpen(false)}>
              Close
            </button>
            <p>Your modal content goes here</p>
            <GoogleDoc googleDocLink="https://docs.google.com/document/d/1w0Xj5Pp-uCikVJSZh_19x3Zb1T5YSX9gEy_2HyOVeLU/edit?usp=sharing"/>
          </>
        )}
      </div>
    </div>
  );
};
