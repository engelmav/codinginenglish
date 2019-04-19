import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './login';


const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Login} />
      {/* <Route path="/student" component={StudentView} /> */}
    </Switch>
  </BrowserRouter>
);

export { Routes };