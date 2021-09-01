import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { navbarCommonStyle, LI } from "../Navbar";
import { darkGray } from "../UtilComponents/sharedStyles";
import { useRouter } from "next/router";

const StyledFooter = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${darkGray};
  text-align: center;
  color: white;
  width: 100%;
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
  console.log("Footer props:", props);
  const links = [
    { text: "PRÓXIMAS_SESIONES", location: "/upcoming-sessions" },
    { text: "CONÓCENOS", location: "/about-us" },
    { text: "TÉCNICA", location: "/technique" },
  ];
  const [policyId, setPolicyId] = useState(null);
  const [title, setTitle] = useState(null);

  const router = useRouter();
  useEffect(() => {
    console.log("router.locale is", router.locale);
    if (["es", "es-CA", "es-ca"].includes(router.locale)) {
      setPolicyId("12197597");
      setTitle("Política de privacidad");
    } else {
      setTitle("Privacy Policy");

      setPolicyId("48905763");
    }
    var s = document.createElement("script");
    let tag = document.getElementsByTagName("script")[0];

    s.src = "https://cdn.iubenda.com/iubenda.js";

    tag.parentNode.insertBefore(s, tag);
  }, [router.locale]);
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
      {props.footerContent.legalLinks.map((link) => (
        <a
          href={link.link}
          className="iubenda-white iubenda-embed"
          title={link.title}
        >
          {link.title}
        </a>
      ))}
      {/* <a
        href={`https://www.iubenda.com/privacy-policy/${policyId}`}
        className="iubenda-white iubenda-embed"
        title={title}
      >
        {title}
      </a>
      <a
        href={`https://www.iubenda.com/privacy-policy/${policyId}/cookie-policy`}
        className="iubenda-white iubenda-embed "
        title="Cookie Policy "
      >
        Cookie Policy
      </a> */}
    </StyledFooter>
  );
};
