import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Link from "next/link";
import { navbarCommonStyle, LI } from "../Navbar";
import { cieOrange, darkGray } from "../UtilComponents/sharedStyles";
import { useRouter } from "next/router";
import { Box, boxy } from "../UtilComponents";
import { P } from "../UtilComponents/Typography/Typography";
import { useAppStore } from "../stores/appStoreReact";

const StyledFooter = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${darkGray};
  text-align: center;
  color: white;
  width: 100%;
  ${boxy}
`;

const NavbarFooter = styled.ul`
  ${navbarCommonStyle};
  flex-direction: column;
  ${boxy}
`;

const A = styled.a`
  color: ${cieOrange};
`;

export const Footer = (props) => {
  const store = useAppStore();
  const links = [
    { text: "PRÓXIMAS_SESIONES", location: "/upcoming-sessions" },
    { text: "CONÓCENOS", location: "/about-us" },
    { text: "TÉCNICA", location: "/technique" },
  ];
  const footerRef = useRef();
  useEffect(() => {
    store.handleSetFooterHeight(footerRef.current?.offsetTop)
    store.setFooterRef(footerRef)
    console.log("footerRef:", footerRef)
    var s = document.createElement("script");
    let tag = document.getElementsByTagName("script")[0];

    s.src = "https://cdn.iubenda.com/iubenda.js";

    tag.parentNode.insertBefore(s, tag);

  }, []);
  
  return (
    <StyledFooter p="3" ref={footerRef}>
      <NavbarFooter>
        {links.map((link, idx) => (
          <LI key={idx}>
            <Link href={link.location}>{link.text}</Link>
          </LI>
        ))}
      </NavbarFooter>
      <P mt="3" color="white">
        Coding in English
      </P>
      <P mb="0" color="white">
        All inquiries:{" "}
        <A href="mailto:support@codinginenglish.com">
          support@codinginenglish.com
        </A>
      </P>
      <P mb="3" color="white">
        45 Glen Ct North Plainfield, NJ 07063 EEUU
      </P>
      {props.footerContent.legalLinks.map((link) => (
        <Box pb="1">
          <a
            href={link.link}
            className="iubenda-white iubenda-embed"
            title={link.title}
          >
            {link.title}
          </a>
        </Box>
      ))}
    </StyledFooter>
  );
};
