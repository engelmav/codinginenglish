import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { navbarCommonStyle, LI } from "../Navbar";
import { darkGray } from "../UtilComponents/sharedStyles";

const StyledFooter = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${darkGray};
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
  const links = [
    { text: "PRÓXIMAS_SESIONES", location: "/upcoming-sessions" },
    { text: "CONÓCENOS", location: "/about-us" },
    { text: "TÉCNICA", location: "/technique" },
  ];
  return (
    <StyledFooter>
      <MadeWithLove>Made with love in Encinitas, California.</MadeWithLove>
      <NavbarFooter>
        {links.map((link, idx) => (
          <LI key={idx}>
            <Link href={link.location}>{link.text}</Link>
          </LI>
        ))}
      </NavbarFooter>
    </StyledFooter>
  );
};
