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
  let hasActiveSession;
  let eventSource;
  const [sessionStarted, setSessionStarted] = useState(false);
  useEffect(() => {
    eventSource = new EventSource('/api/stream');
    eventSource.addEventListener('classUpdate', event => {
      console.log('received sessionStart event');
      const { data } = event;
      try {
        const eventData = JSON.parse(data);
        console.log("event data:", eventData);
        setSessionStarted(true);
      } catch (ex) {
        console.log("Unable to parse event data:", data);
      }
    })
  })


  return (
    <Switch>
      <Route path="/class"><div></div></Route>
      <Route path="*">
        <HeaderElem>
          <Img alt="cie logo" src="https://cie-assets.nyc3.digitaloceanspaces.com/cie-logo-hands.png"></Img>
          <RoutesUL>
            <li><Link to="/">home</Link></li>
            <li><Link to="/classes">upcoming_classes</Link></li>
            {appStore.authData &&
              <>
                <li><Link to="/my-dashboard">my_dashboard</Link></li>
                {sessionStarted && <li><Link to="/class">in_session!</Link></li>}
              </>
            }
            <li><Login auth={auth} isAuthenticated={appStore.authData} /></li>
          </RoutesUL>
        </HeaderElem>
      </Route>
    </Switch>
  );
});

export default Header; 