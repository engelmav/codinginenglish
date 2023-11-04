import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styled, { css } from "styled-components";
import { space, width } from "styled-system";
import {
  debugBorder,
  whenSmallScreen,
  sm,
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
import Modal from "../components/Modal";
import { useAppStore } from "../stores/appStoreReact";
import { HeaderImage } from "../components/HeaderImage";
import { styled as compiledStyled } from "@compiled/react";

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

/* background-color: rgba(darkGrayRgb, 0.9); */
/* box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 4px 0px; */
/*
  ${boxy}

*/
const HeaderStyle = compiledStyled.header`
  position: sticky;
  z-index: 1;
  top: 0;
  background-color: ${darkGray};
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 1rem;
  flex-shrink: 2;
  align-items: center;
  justify-content: space-between;
`;

const Img2 = styled.img`
  ${boxy}
  cursor: pointer;
`;

const LangUl = compiledStyled.ul``;

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

export const CloseBanner = compiledStyled(FaRegWindowClose)`
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

const LangOptsBox = compiledStyled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LangOpts = ({ closeLanguageSelector }) => (
  <LangOptsBox>
    <LangUl>
      {Object.keys(locales).map((localeKey, idx) => {
        const hrefObj = {
          pathname: Router.pathname,
          query: Router.query.slug && { slug: Router.query.slug },
          locale: locales[localeKey],
        }

        return (
          <LI mb={2} fontSize={20} onClick={closeLanguageSelector} key={idx}>
            <Link
              href={hrefObj}
              locale={locales[localeKey]}
            >
              {localeKey}
            </Link>
          </LI>
        );
      })}
    </LangUl>
  </LangOptsBox>
);

const HeaderContainer = (props) => {
  const [navMenu, setNavMenu] = useState(false);
  const navMenuRef = useRef(null);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [inApplyRoute, setInApplyRoute] = useState(false);
  const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false);
  const showLanguageSelector = () => setLanguageSelectorOpen(true);
  const closeLanguageSelector = () => setLanguageSelectorOpen(false);

  const store = useAppStore();
  const ref = useRef(null);

  useEffect(() => {
    store.handleSetHeaderHeight(ref.current?.clientHeight);
  }, []);

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
  let { links } = props.headerContent;
  links = links.map((link) => {
    link.onClick = () => setNavMenu(false);
    return link;
  });

  return (
    <>
      {languageSelectorOpen && (
        <Modal
          styleProps={{ maxWidth: "600px" }}
          title="Language"
          onClose={() => setLanguageSelectorOpen(false)}
        >
          <LangOpts closeLanguageSelector={closeLanguageSelector} />
        </Modal>
      )}
      <HeaderStyle ref={ref}>
        <Link href="/">
          <HeaderImage
            loading="lazy"
            alt="cie logo"
            srcSet={`${settings.assets}/CIE_Logo_Horizontal_transparent_282w.webp 282w, ${settings.assets}/CIE_Logo_Horizontal_transparent_490w.webp 1920w`}
            src={`${settings.assets}/CIE_Logo_Horizontal_transparent_490w.webp`}
          ></HeaderImage>
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
