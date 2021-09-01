import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styled, { css } from "styled-components";
import { space, width } from "styled-system";
import {
  debugBorder,
  whenSmallScreen,
  darkGray,
  darkGrayRgb,
  fontMonospace,
} from "../UtilComponents/sharedStyles";
import { ApplyButton, boxy, Box } from "../UtilComponents";
import { P } from "../UtilComponents/Typography/Typography";
import { navbarCommonStyle, LI } from "../Navbar";
import { FaRegWindowClose } from "@react-icons/all-files/fa/FaRegWindowClose";
import ReactGA from "react-ga";
import settings from "../settings";
import Login from "../Login/Login";
import Router from "next/router";
import Modal from "../components/Modal"
import { useAppStore } from "../stores/appStoreReact";

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

const HeaderStyle = styled.header`
  ${boxy}
  /* background-color: rgba(darkGrayRgb, 0.9); */
  /* box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 4px 0px; */
  position: sticky;
  z-index: 1;
  top: 0;
  ${debugBorder}
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 1rem;
  ${whenSmallScreen`
      ${headerMarginSm}`}
  align-items: center;
  background-color: ${darkGray};
  flex-shrink: 2;
`;

const Img = styled.img`
  ${space}
  ${width}
  min-width: 180px;
  ${whenSmallScreen`
      max-width: 180px;`}
  cursor: pointer;
`;

const Img2 = styled.img`
  ${boxy}
  cursor: pointer;
`;

const LangUl = styled.ul``;

const locales = {
  english: "en",
  català: "ca-es",
  español: "es",
};

const NavbarUl = styled.ul`
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
  width: 100%;
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

const HeaderContainer = (props) => {
  const [navMenu, setNavMenu] = useState(false);
  const navMenuRef = useRef(null);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [inApplyRoute, setInApplyRoute] = useState(false);
  const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false);
  const showLanguageSelector = () => setLanguageSelectorOpen(true);
  const closeLanguageSelector = () => setLanguageSelectorOpen(false);
  // const [height, setHeight] = useState(0)
  const [headerHeight, setHeaderHeight] = useAppStore();
  
  const ref = useRef(null)

  useEffect(() => {
    setHeaderHeight(ref.current?.clientHeight)
  }, [])

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

  let { links } = props.headerContent;
  links = links.map((link) => {
    link.onClick = () => setNavMenu(false);
    return link;
  });

  const LangOptsBox = styled.div`
    ${boxy}

  `

  const LangOpts = () =>
    <LangOptsBox height="100%" display="flex" alignItems="center" justifyContent="center">
    <LangUl>
      {Object.keys(locales).map((localeKey) => (
        <LI mb={2} fontSize={20} onClick={closeLanguageSelector}>
          <Link href={Router.pathname} locale={locales[localeKey]}>
            {localeKey}
          </Link>
        </LI>
      ))}
    </LangUl>
    </LangOptsBox>

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
      {languageSelectorOpen && (
        <Modal styleProps={{maxWidth: "600px"}} title="Language" onClose={()=>setLanguageSelectorOpen(false)}><LangOpts /></Modal>
      )}
      <HeaderStyle justifyContent={["space-between"]} ref={ref}>
        <Link href="/">
          <Img
            loading="lazy"
            alt="cie logo"
            srcSet={`${settings.assets}/CIE_Logo_Horizontal_transparent_282w.webp 282w, ${settings.assets}/CIE_Logo_Horizontal_transparent_490w.webp 1920w`}
            src={`${settings.assets}/CIE_Logo_Horizontal_transparent_490w.webp`}
          ></Img>
        </Link>
        <Box display="flex" alignItems="center">
          <Img2
            {...{ mr: [3, 3, 0] }}
            loading="lazy"
            alt="lang"
            width="22px"
            height="22px"
            src={`${settings.edgeAssets}/icon128px-exported-black.jpg`}
            onClick={showLanguageSelector}
          />
          <NavbarUl navMenu={navMenu} ref={navMenuRef}>
            <LI>
              <CloseBox size="20" onClick={() => setNavMenu(false)} />
            </LI>
            {links.map((link, idx) => (
              <LI onClick={link.onClick} key={idx}>
                <Link href={link.location}>{link.text}</Link>
              </LI>
            ))}
            <Login />
          </NavbarUl>
          <Hamburger viewBox="0 0 100 80" onClick={() => setNavMenu(true)}>
            <rect width="100" height="20"></rect>
            <rect y="30" width="100" height="20"></rect>
            <rect y="60" width="100" height="20"></rect>
          </Hamburger>
        </Box>
      </HeaderStyle>
    </>
  );
};

export async function getStaticProps({ locale }) {
  console.log("***** LAYOUT HEADER FETCH Layout header fetch");
  const localeContentUrl = `https://content.codinginenglish.com/header?_locale=${locale}`;
  const res = await fetch(localeContentUrl);
  console.log("result of header fetch:", res);
  const content = await res.json();
  return {
    props: {
      content,
    },
  };
}

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
