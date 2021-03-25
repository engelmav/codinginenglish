import React from 'react';
import Login from '../Login';
import { Link, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { darkGray, debugBorder } from "../UtilComponents/sharedStyles";

import { observer } from 'mobx-react';


const Header = styled.header`
  ${debugBorder}
  margin-bottom: 2rem;
  max-width:100%; 
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background-color: ${darkGray};
`;

const Img = styled.img`
  background-color: white;
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
  font-family: 'Roboto Mono', monospace;
  font-size: clamp(1rem, 1.25vw, 1.25rem);
  list-style-type: none;
  padding: 0;
  margin: 10px;
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
    font-family: 'Roboto Mono', monospace;
    padding-right: 4px;
    padding-left: 4px;
  }
  li a:hover {
    background-color: #ff3e00;
    color: white;
    padding: 4px;
`;



const HeaderContainer = observer((props) => {
  const {
    auth,
    appStore,
  } = props;

  return (
    <Switch>
      <Route path="/class"><div></div></Route>
      <Route path="*">
        <Header>
          <Img alt="cie logo" src="https://cie-assets.nyc3.digitaloceanspaces.com/cie-logo-hands.png"></Img>
          <RoutesUL>
            <li><Link to="/">home</Link></li>
            <li><Link to="/about">about_us</Link></li>
            <li><Link to="/upcoming-sessions">upcoming_classes</Link></li>
            {appStore.authData &&
              <>
                <li><Link to="/my-dashboard">my_dashboard</Link></li>
                {appStore.sessionInProgress && <li><Link to="/class">in_session!</Link></li>}
              </>
            }
            <li><Login auth={auth} appStore={appStore} /></li>
          </RoutesUL>
        </Header>
      </Route>
    </Switch>
  );
});

export { HeaderContainer as Header }; 