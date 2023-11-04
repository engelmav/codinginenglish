import { styled, css } from "@linaria/react"
import React from "react";
import Link from "next/link"
import { cieOrange } from "./colors"

const buttonCommon = {
  fontFamily: "Roboto Mono",
  fontSize: ".7em",
  borderRadius: 5,
  fontWeight: 600,
  color: "white",
  backgroundColor: cieOrange
};

const Thing = styled.a`
  text-decoration: none;
  color: white;
  background-color: red;
  ${buttonCommon};
  padding: 10px;
  &:hover {
    text-decoration: none;
    color: rgba(255, 255, 255, 1);
    box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
  }
  &:active {
    transform: scale(0.99);
  }
  
`

export const LinkButton = (props) => {
  const { children, href, ...otherProps } = props;
  return (
    <Link href={href} passHref>
        <Thing {...otherProps}>{children}</Thing>
    
    </Link>
  );
};