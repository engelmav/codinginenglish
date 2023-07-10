import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CloseButton,
  Nav,
  NavLink,
  MobileNav,
  MobileNavLink,
  MobileHamburgerButton,
} from "../components/nav";
import tw from "twin.macro";
import { WhatsApp, CloseIcon } from "./svgIcons";

const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif;
    background-color: EDF2F4;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
`;

export const ContentSection = tw.div`
  flex flex-col items-center justify-center p-5
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
  max-width: 1280px;
  align-self: center;
  // margin: 2rem auto;
  // padding: 0 1rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  top: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
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

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #333;
`;

const FooterText = styled.div`
  color: #fff;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  grid: 10px;
`;

const navLinks = [
  // { href: "/courses", text: "Courses" },
  { href: "/blog", text: "Blog" },
  { href: "/events", text: "Events" },
  { href: "/about-us", text: "About Us" },
  { href: "/partners", text: "Partners" },
];

// tailwind button component with horizontal flex
const Button = tw.button`

  flex
  items-center
  justify-center
  px-4
  py-2
  mt-3

  border
  border-transparent
  text-base
  font-medium
  rounded-md
  shadow-sm
  text-white
  bg-blue-600
  hover:bg-blue-700
  focus:outline-none
  focus:ring-2
  focus:ring-offset-2
  focus:ring-blue-500
  `;

export function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <Global styles={globalStyles} />
      <PageWrapper>
        <Header>
          <Link href="/">
            <Image
              style={{ width: "300px", height: "auto" }}
              src="/cie_horizontal_white.jpg"
              alt="Coding in English"
              width="1462"
              height="209"
            />
          </Link>
          <Nav>
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.text}
              </NavLink>
            ))}
          </Nav>
          <MobileHamburgerButton onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
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
            {navLinks.map((link, idx) => (
              <MobileNavLink key={idx} href={link.href} onClick={toggleMenu}>
                {link.text}
              </MobileNavLink>
            ))}
          </MobileNav>
        </Header>
        <Main>{children}</Main>
        <Footer>
          <FooterText>
            <p>&copy; {new Date().getFullYear()} Coding in English</p>

            <p>108 Watchung Ave Plainfield, NJ 07060</p>

            <Button
              onClick={() =>
                (window.location.href = "https://wa.me/19176557273")
              }
            >
              <WhatsApp />
              <div style={{ paddingLeft: "5px" }}>+1 (917) 655 7273</div>
            </Button>
          </FooterText>
        </Footer>
      </PageWrapper>
    </>
  );
}
