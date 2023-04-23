// pages/index.js
import styled from "@emotion/styled";

import { css, Global } from "@emotion/react";
import { useState } from "react";
import {
  CloseButton,
  CloseIcon,
  Nav,
  NavLink,
  MobileNav,
  MobileNavLink,
  MobileHamburgerButton,
} from "../components/nav";
import { P, UL } from "../components/typography";
import { NewsletterForm } from "../components/newsletter";

const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif;
    background-color: #111;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  display: flex;
  //   justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;
  //   background-color: #f0f2f5;
  width: 100%;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  //   position: fixed;
  top: 0;
  left: 0;
  right: 0;
  //   z-index: 1000;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: rgba(17, 17, 17, 0.8); // Dark background with transparency
`;

const Logo = styled.h2`
  //   font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin: 0;
`;

const Card = styled.section`
  width: 80%;
  max-width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Heading = styled.h1`
  margin-bottom: 1rem;
  font-size: 2rem;
  color: #333;
`;

const Subheading = styled.p`
  margin-bottom: 2rem;
  font-size: 1.125rem;
  color: #666;
`;

const Button = styled.a`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #0070f3;
  color: white;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0059d6;
  }
`;
const Footer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #333;
`;

const FooterText = styled.p`
  color: #fff;
`;

const Tagline = styled.div`
  font-family: "Montserrat", sans-serif;
  font-weight: 800; /* Extra bold */
  font-size: 3rem;
  color: #ffc107;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Optional: Add a subtle text shadow for better contrast */
  margin-bottom: 1rem;
  margin-top: 1rem;
  margin: 0 auto;
  text-align: center;
`;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <Global styles={globalStyles} />
      <PageWrapper>
        <Header>
          <Logo>coding_in_english</Logo>
          <Nav>
            <NavLink href="/feature1">Feature 1</NavLink>
            <NavLink href="/feature2">Feature 2</NavLink>
            <NavLink href="/feature3">Feature 3</NavLink>
          </Nav>
          <MobileHamburgerButton onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </MobileHamburgerButton>
          <MobileNav isOpen={menuOpen}>
            <CloseButton onClick={toggleMenu}>
              <CloseIcon
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </CloseIcon>
            </CloseButton>
            <MobileNavLink href="/feature1" onClick={toggleMenu}>
              About Us
            </MobileNavLink>
            <MobileNavLink href="/feature2" onClick={toggleMenu}>
              FAQ
            </MobileNavLink>
            <MobileNavLink href="/feature3" onClick={toggleMenu}>
              Events
            </MobileNavLink>
          </MobileNav>
        </Header>
        <Main>
          <div style={{ marginBottom: "2em" }}>
            <Tagline>
              aprende a programar.
              <br />
              —
              <br />
              mejora tu inglés.
              <br />
              —
              <br />
              consigue trabajo.
            </Tagline>
          </div>
          <P>
            No sólo aprendas inglés. <i>Haz</i> algo con tu inglés - y gana
            dinero como programador de software.{" "}
          </P>
          <P>
            Nuestro curso único te enseña ambas cosas a la vez, y provee
            consejo, ayuda y orientación profesional para conseguir un trabajo
            moderno - <i>sin fronteras.</i>
          </P>

          <div style={{ marginBottom: "2em", marginTop: "1em" }}>
            <UL>
              {[
                "Clases de noche",
                "Pago flexible",
                "Ayuda para conseguir trabajo remoto",
                "No necesitas tu propia computadora",
              ].map((li) => (
                <li>{li}</li>
              ))}
            </UL>
          </div>
          <NewsletterForm />
        </Main>
        <Footer>
          <FooterText>
            &copy; {new Date().getFullYear()} Your Company Name
          </FooterText>
        </Footer>
      </PageWrapper>
    </>
  );
}
