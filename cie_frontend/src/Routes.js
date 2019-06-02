import React, { Component } from 'react';
import './App.css';
import { Router, Route, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import history from './history';
import Login from './Login';
import Home from './Home';
import Auth from './auth/Auth';
import makeRequiresAuth from './auth/RequiresAuth';
import Callback from './auth/Auth0Callback';
import ClassroomContainer from './aula/ClassroomContainer';


var auth = new Auth();
var requiresAuth = makeRequiresAuth(auth);
// const ClassRoomProtected = requiresAuth(ClassroomContainer);
const HomeProtected = requiresAuth(Home);
const CallbackWithRouter = withRouter(Callback);

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}

const makeRoutes = () => {
  return (
    <Router history={history}>
      <div>
        <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/class">Class</Link></li>
        </ul> 

        <Route exact path="/"          render={(props) => { return <Login auth={auth} {...props} />; } }/>
        
        <Route exact path="/home"      component={(props) => <HomeProtected {...props} />} />
        <Route exact path="/class"     component={(props) => <ClassroomContainer {...props} />} />
        <Route       path="/callback"  render={(props) => {
          handleAuthentication(props);
          return <CallbackWithRouter {...props} />
        }} />
      </div>
    </Router>
  );
}

export default makeRoutes;