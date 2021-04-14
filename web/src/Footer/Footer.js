import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { navbarCommonStyle } from "../Navbar";
import { Box } from "../UtilComponents/Box";

const StyledFooter = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: black;
  text-align: center;
  color: white;
`;

const MadeWithLove = styled.i`
  padding: 20px;
`;

const NavbarFooter = styled.ul`
  ${navbarCommonStyle};
  flex-direction: column;
  padding-bottom: 20px;
`;
export const Footer = (props) => {
  const { Login } = props;
  const links = [
    { text: "upcoming_sessions", location: "/upcoming-sessions" },
    { text: "about_us", location: "/about-us" },
    { text: "technique", location: "/technique" },
  ];
  return (
    <StyledFooter>
      <MadeWithLove>Made with love in Encinitas, California.</MadeWithLove>
      <Box pb="20px">
      <Login />
      </Box>
      <NavbarFooter>
        {links.map((link, idx) => (
          <li key={idx}>
            <Link to={link.location}>{link.text}</Link>
          </li>
        ))}
      </NavbarFooter>
    </StyledFooter>
  );
};
