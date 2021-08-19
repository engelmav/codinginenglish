import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styled, { css } from "styled-components";
import {
  debugBorder,
  whenSmallScreen,
  darkGray,
  fontMonospace,
} from "../UtilComponents/sharedStyles";
import { boxy } from "../UtilComponents";
import { P } from "../UtilComponents/Typography/Typography";
import { navbarCommonStyle, LI } from "../Navbar";
import { FaRegWindowClose } from "@react-icons/all-files/fa/FaRegWindowClose";
import ReactGA from "react-ga";
import settings from "../settings";
import Login from "../Login/Login";
import Router from "next/router";

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const headerMarginSm = css`
  padding: 1rem;
`;

const CloseBox = styled(FaRegWindowClose)`
  display: none;
  color: white;
  background-color: ${darkGray};
  align-self: flex-end;
  cursor: pointer;
  transition: 0.2s;
  :hover {
    background-color: ${darkGray};
    color: white;
  }
  ${whenSmallScreen`
      display: block;`}
`;
const Hamburger = styled.svg`
  height: 20px;
  width: 20px;
  display: none;
  rect {
    fill: white;
    stroke: ${darkGray};
    stroke-width: 10px;
  }
  cursor: pointer;
  ${whenSmallScreen`
      display: block;`}
`;

const Header = styled.header`
  box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 4px 0px;
  position: sticky;
  z-index: 1;
  top: 0;
  ${debugBorder}
  max-width: 100%;
  width: 100%;
  display: flex;
  height: 200x;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 1rem;
  ${whenSmallScreen`
      ${headerMarginSm}`}
  align-items: center;
  background-color: ${darkGray};
`;

const Img = styled.img`
  width: auto;
  height: 70px;
  cursor: pointer;
  ${whenSmallScreen`
      height: 28px; padding-top: 5px;`}
`;

const NavbarList = styled.ul`
  ${navbarCommonStyle}
  ${whenSmallScreen`
    li {
      margin-bottom: 2rem;
      padding-right: 0;
      margin-right: 0;
    }
    position: fixed;
    right: -10px;
    z-index: 1;
    top: 0;
    height: 100%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    ${headerMarginSm}
    background-color: ${darkGray};
    transition: 0.1s ease-out;
    transform: ${({ navMenu }) =>
      navMenu ? `translateX(-10px)` : `translateX(100%)`};`}
`;

const Banner = styled.div`
  ${boxy}
  margin: 0;
  background: yellow;
  display: flex;
  justify-content: center;
  align-items: center;
  ${whenSmallScreen`
      font-size: 12px;
      padding-left: 3px;
  padding-right: 3px;
      `}
`;

const ApplyButton = styled.button`
  padding: 2px;
  ${fontMonospace}
  outline: 0;
  cursor: pointer;
  background: yellow;
  color: black;
  border: 2px black solid;
  border-radius: 2px;
  &:focus {
    outline: none;
    outline-offset: -4px;
  }
  &:hover {
    color: yellow;
    background: black;
  }
  &:active {
    transform: scale(0.99);
  }
  margin-left: 6px;
  ${whenSmallScreen`
      font-size: 10px;
      margin-right: 6px;
      `}
`;

export const CloseBanner = styled(FaRegWindowClose)`
  color: black;
  background-color: yellow;
  cursor: pointer;
  transition: 0.2s;
  :hover {
    background-color: black;
    color: yellow;
  }
  margin-right: 6px;
  margin-left: auto;
`;

const HeaderContainer = (props) => {
  const [navMenu, setNavMenu] = useState(false);
  const navMenuRef = useRef(null);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [inApplyRoute, setInApplyRoute] = useState(false);

  const detectBackgroundClickAndCloseNav = (event) => {
    if (navMenuRef.current && navMenuRef.current.contains(event.target)) {
      return;
    }
    setNavMenu(false);
  };

  useEffect(() => {
    if (Router.pathname.includes("/apply")) {
      setInApplyRoute(true);
    }
    document.addEventListener("mousedown", detectBackgroundClickAndCloseNav);
    // Unbind listener on cleanup.
    return () =>
      document.removeEventListener(
        "mousedown",
        detectBackgroundClickAndCloseNav
      );
  }, [navMenuRef]);

  const hideNav = { onClick: () => setNavMenu(false) };
  const links = [
    { text: "PRÓXIMAS_SESIONES", location: "/upcoming-sessions", ...hideNav },
    { text: "CONÓCENOS", location: "/about-us", ...hideNav },
    { text: "TÉCNICA", location: "/technique", ...hideNav },
  ];

  function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  }

  function daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.floor(
      (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay
    );
  }

  return (
    <>
      {bannerOpen && !inApplyRoute && (
        <Banner p={[1, 2, 2, 2]}>
          <P mb={0}>
            El curso <i>WebApp Development - Basic</i>
            {` empieza en ${daysBetween(
              new Date(),
              new Date("9/20/2021 12:00 AM")
            )} días.`}
          </P>
          <Link href="/apply">
            <ApplyButton
              onClick={() => {
                ReactGA.event({
                  category: "register",
                  action: "clickedYellowBanner",
                  label: "solicitaUnaPlaza",
                });
                setBannerOpen(false);
              }}
            >
              ¡Inscríbete ahora!
            </ApplyButton>
          </Link>
          <CloseBanner size="25" onClick={() => setBannerOpen(false)} />
        </Banner>
      )}
      <Header>
        <Link href="/">
          <Img
            loading="lazy"
            alt="cie logo"
            srcSet={`${settings.assets}/CIE_Logo_Horizontal_transparent_282w.webp 282w, ${settings.assets}/CIE_Logo_Horizontal_transparent_490w.webp 1920w`}
            sizes="(min-width: 600px) 692px, 282px"
            src={`${settings.assets}/CIE_Logo_Horizontal_transparent_490w.webp 1920w`}
          ></Img>
        </Link>
        <NavbarList navMenu={navMenu} ref={navMenuRef}>
          <LI>
            <CloseBox size="20" onClick={() => setNavMenu(false)} />
          </LI>
          {links.map((link, idx) => (
            <LI onClick={link.onClick} key={idx}>
              <Link href={link.location}>{link.text}</Link>
            </LI>
          ))}
          <Login />
        </NavbarList>
        <Hamburger viewBox="0 0 100 80" onClick={() => setNavMenu(true)}>
          <rect width="100" height="20"></rect>
          <rect y="30" width="100" height="20"></rect>
          <rect y="60" width="100" height="20"></rect>
        </Hamburger>
      </Header>
    </>
  );
};

export default HeaderContainer;

/**
 

          {/* {appStore.authData && ( this would make us load appStore right away..rethink
              <>
                <LI>
                  <Link href="/my-dashboard">my_dashboard</Link>
                </LI>
                <LI>
                  <Link href="/class">in_session!</Link>
                </LI>
              </>
            )} 
            <li>

        


      </Header>

 */
