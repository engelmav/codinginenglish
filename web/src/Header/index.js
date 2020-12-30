import React, { useEffect, useState } from 'react';
import Login from '../Login';
import { Link, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { observer } from 'mobx-react';


const HeaderElem = styled.header`
  margin-top: 40px;
  padding: 15px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  position: relative;
  z-index: 1;
  max-width:100%; 
`;

const Img = styled.img`
  border: 1px black solid;
  top: -30px;
  left: 75px;
  float: left;
  position: absolute;
  z-index: 2;
  background-color: white;
`;


const RoutesUL = styled.ul`
  float: right;
  color: #3d3636;
  font-weight: 900;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  font-family: 'Roboto Mono', monospace;

  list-style-type: none;
  padding: 0;
  margin: 0;
  align-self: center;
  li {
    display: inline-block;
    padding-right: 10px;
  }
  li a {
    color: #3d3636;
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


const Header = observer((props) => {
  const {
    auth,
    appStore,
  } = props;

  return (
    <Switch>
      <Route path="/class"><div></div></Route>
      <Route path="*">
        <HeaderElem>
          <Img alt="cie logo" src="https://cie-assets.nyc3.digitaloceanspaces.com/cie-logo-hands.png"></Img>
          <RoutesUL>
            <li><Link to="/">home</Link></li>
            <li><Link to="/upcoming-sessions">upcoming_classes</Link></li>
            {appStore.authData &&
              <>
                <li><Link to="/my-dashboard">my_dashboard</Link></li>
                {appStore.sessionInProgress && <li><Link to="/class">in_session!</Link></li>}
              </>
            }
            <li><Login auth={auth} appStore={appStore} /></li>
          </RoutesUL>
        </HeaderElem>
      </Route>
    </Switch>
  );
});

export { Header }; 