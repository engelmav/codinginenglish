import React, { useEffect, useRef, useState } from "react";
import { Link, Route, Switch } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import {
  debugBorder,
  whenSmallScreen,
  orangeBgColor,
  cieOrange,
  font,
  fontMonospace,
} from "../UtilComponents/sharedStyles";
import { P } from "../UtilComponents/Typography/Typography";
import { navbarCommonStyle, LI } from "../Navbar";
import { GiHamburgerMenu } from "@react-icons/all-files/gi/GiHamburgerMenu";
import { observer } from "mobx-react";
import { FaRegWindowClose } from "@react-icons/all-files/fa/FaRegWindowClose";
import { CSSTransition } from "react-transition-group";
import { fadeIn } from "react-animations";

const animation = keyframes`${fadeIn}`;

const BouncyDiv = styled.div`
  animation: 4s ${animation};
`;

const headerMarginSm = css`
  padding: 1rem;
`;

const CloseBox = styled(FaRegWindowClose)`
  display: none;
  color: white;
  background-color: black;
  align-self: flex-end;
  cursor: pointer;
  transition: 0.2s;
  :hover {
    background-color: black;
    color: white;
  }
  ${whenSmallScreen`
      display: block;`}
`;
const Hamburger = styled(GiHamburgerMenu)`
  display: none;
  color: white;
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
  background-color: black;
`;

const Img = styled.img`
  width: auto;
  height: 70px;
  ${whenSmallScreen`
      height: 25px; padding-top: 5px;`}
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
    background-color: black;
    transition: 0.1s ease-out;
    transform: ${({ navMenu }) =>
      navMenu ? `translateX(-10px)` : `translateX(100%)`};`}
`;

const GradualLi = styled.li`
  .my-node-enter {
    opacity: 0;
  }
  .my-node-enter-active {
    opacity: 1;
    transition: opacity 200ms;
  }
  .my-node-exit {
    opacity: 1;
  }
  .my-node-exit-active {
    opacity: 0;
    transition: opacity 200ms;
  }
`;

const LinkButton = styled(Link)`
  overflow: auto;
  font-size: 13.3333px;
  text-transform: lowercase;
  background-color: ${cieOrange};
  border-radius: 2px;
  font-weight: 100;
  font-family: "Arial", "sans-serif";
  background-color: ${cieOrange};
  text-decoration: none;
  padding: 8px;
  color: white;
  a {
    font-family: "Arial", "sans-serif";
    color: white;
    background-color: ${cieOrange};
    ${orangeBgColor}
    text-decoration: none;
    display: inline-block;
    text-align: center;
    padding: 10px;
    justify-items: space-between;
  }
`;

const Banner = styled.div`
  margin: 0;
  background: yellow;
  display: flex;
  padding: 1px;
  justify-content: center;
  align-items: center;
  padding-left: 6px;
  padding-right: 6px;
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

const HeaderContainer = observer((props) => {
  const { auth, appStore, settings, Login } = props;
  const [navMenu, setNavMenu] = useState(false);
  const navMenuRef = useRef(null);
  const [bannerOpen, setBannerOpen] = useState(true);

  const detectBackgroundClickAndCloseNav = (event) => {
    if (navMenuRef.current && navMenuRef.current.contains(event.target)) {
      return;
    }
    setNavMenu(false);
  };

  useEffect(() => {
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

  return (
    <Switch>
      <Route path="/class">
        <div></div>
      </Route>
      <Route path="*">
        {bannerOpen && (
          <BouncyDiv>
            <Banner>
              <P>
                Se ha abierto la matrícula del curso{" "}
                <i>WebApp Development - Basic</i>
              </P>
              <Link to="/apply">
                <ApplyButton onClick={() => setBannerOpen(false)}>
                  solicita una plaza
                </ApplyButton>
              </Link>
              <CloseBanner
                size="25"
                alignSelf="flex-end"
                onClick={() => setBannerOpen(false)}
              />
            </Banner>
          </BouncyDiv>
        )}
        <Header>
          <Link to="/">
            <Img
              alt="cie logo"
              src={`${settings.assets}/cie-logo-horizontal-black.png`}
            ></Img>
          </Link>
          <NavbarList navMenu={navMenu} ref={navMenuRef}>
            <LI>
              <CloseBox size="20" onClick={() => setNavMenu(false)} />
            </LI>
            {links.map((link, idx) => (
              <LI onClick={link.onClick} key={idx}>
                <Link to={link.location}>{link.text}</Link>
              </LI>
            ))}
            {appStore.authData && (
              <>
                <LI>
                  <Link to="/my-dashboard">my_dashboard</Link>
                </LI>

                <CSSTransition
                  in={appStore.sessionInProgress}
                  timeout={200}
                  classNames="my-node"
                >
                  <LI>
                    <Link to="/class">in_session!</Link>
                  </LI>
                </CSSTransition>
              </>
            )}
            <li>
              <Login />
            </li>
          </NavbarList>
          <Hamburger size="20" onClick={() => setNavMenu(true)} />
        </Header>
      </Route>
    </Switch>
  );
});

export { HeaderContainer as Header };
