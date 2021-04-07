import React, { useEffect, useRef, useState } from "react";
import Login from "../Login";
import { Link, Route, Switch } from "react-router-dom";
import styled, { css } from "styled-components";
import {
  darkGray,
  debugBorder,
  whenSmallScreen,
} from "../UtilComponents/sharedStyles";
import { GiHamburgerMenu } from "react-icons/gi";
import { observer } from "mobx-react";
import { FaRegWindowClose } from "react-icons/fa";

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
  ${debugBorder}
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 2rem;
  ${whenSmallScreen`
      justify-content: space-between;
      ${headerMarginSm}`}
  align-items: center;
  background-color: black;
`;

const Img = styled.img`
  width: auto;
  height: 70px;
  ${whenSmallScreen`
      height: 25px;`}
`;

const RoutesUL = styled.ul`
  ${debugBorder}
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  font-weight: 900;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  font-family: "Roboto Mono", monospace;
  font-size: clamp(1rem, 1.25vw, 1.25rem);
  list-style-type: none;
  padding: 0;
  margin: 0px;
  align-self: center;
  li {
    display: inline-block;
    padding-right: 10px;
  }
  li a {
    color: white;
    font-weight: 900;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    font-family: "Roboto Mono", monospace;
    padding-right: 4px;
    padding-left: 4px;
  }
  li a:hover {
    background-color: #ff3e00;
    color: white;
    padding: 4px;
  }
  ${whenSmallScreen`
    li {
      margin-bottom: 2rem;
      padding-right: 0;
      margin-right: 0;
    }
    position: fixed;
    right: -10px;
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

const HeaderContainer = observer((props) => {
  const { auth, appStore, settings } = props;
  const [navMenu, setNavMenu] = useState(false);
  const navMenuRef = useRef(null);

  const closeNavMenu = (event) => {
    if (navMenuRef.current && navMenuRef.current.contains(event.target)) {
      return;
    }
    setNavMenu(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeNavMenu);
    // Unbind listener on cleanup.
    return () => document.removeEventListener("mousedown", closeNavMenu);
  }, [navMenuRef]);

  const hideNav = { onClick: closeNavMenu };
  const links = [
    { text: "upcoming_sessions", location: "/upcoming-sessions", ...hideNav },
    { text: "about_us", location: "/about-us", ...hideNav },
    { text: "technique", location: "/", ...hideNav },
  ];

  return (
    <Switch>
      <Route path="/class">
        <div></div>
      </Route>
      <Route path="*">
        <Header>
          <Img
            alt="cie logo"
            src={`${settings.assets}/cie-logo-horizontal-black.png`}
          ></Img>
          <RoutesUL navMenu={navMenu} ref={navMenuRef}>
            {links.map((link, idx) => (
              <li onClick={link.onClick} key={idx}>
                <Link to={link.location} >{link.text}</Link>
              </li>
            ))}
            {appStore.authData && (
              <>
                <li>
                  <Link to="/my-dashboard">my_dashboard</Link>
                </li>
                {appStore.sessionInProgress && (
                  <li>
                    <Link to="/class">in_session!</Link>
                  </li>
                )}
              </>
            )}
            <li>
              <Login auth={auth} appStore={appStore} />
            </li>
          </RoutesUL>
          <Hamburger size="20" onClick={() => setNavMenu(true)} />
        </Header>
      </Route>
    </Switch>
  );
});

export { HeaderContainer as Header };
