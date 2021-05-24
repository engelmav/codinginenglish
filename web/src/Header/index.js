import React, { useEffect, useRef, useState } from "react";
import { Link, Route, Switch } from "react-router-dom";
import styled, { css } from "styled-components";
import { debugBorder, whenSmallScreen } from "../UtilComponents/sharedStyles";
import { navbarCommonStyle } from "../Navbar";
import { GiHamburgerMenu } from "react-icons/gi";
import { observer } from "mobx-react";
import { FaRegWindowClose } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";

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

const NavbarHeader = styled.ul`
  ${navbarCommonStyle}
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

const HeaderContainer = observer((props) => {
  const { auth, appStore, settings, Login } = props;
  const [navMenu, setNavMenu] = useState(false);
  const navMenuRef = useRef(null);

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
    { text: "upcoming_sessions", location: "/upcoming-sessions", ...hideNav },
    { text: "about_us", location: "/about-us", ...hideNav },
    { text: "technique", location: "/technique", ...hideNav },
  ];

  return (
    <Switch>
      <Route path="/class">
        <div></div>
      </Route>
      <Route path="*">
        <Header>
          <Link to="/">
            <Img
              alt="cie logo"
              src={`${settings.assets}/cie-logo-horizontal-black.png`}
            ></Img>
          </Link>

          <NavbarHeader navMenu={navMenu} ref={navMenuRef}>
            <li>
              <CloseBox size="20" onClick={() => setNavMenu(false)} />
            </li>
            {links.map((link, idx) => (
              <li onClick={link.onClick} key={idx}>
                <Link to={link.location}>{link.text}</Link>
              </li>
            ))}
            {appStore.authData && (
              <>
                <li>
                  <Link to="/my-dashboard">my_dashboard</Link>
                </li>

                <CSSTransition
                  in={appStore.sessionInProgress}
                  timeout={200}
                  classNames="my-node"
                >
                  <GradualLi>
                    <Link to="/class">in_session!</Link>
                  </GradualLi>
                </CSSTransition>
              </>
            )}
            <li>
              <Login />
            </li>
          </NavbarHeader>
          <Hamburger size="20" onClick={() => setNavMenu(true)} />
        </Header>
      </Route>
    </Switch>
  );
});

export { HeaderContainer as Header };
