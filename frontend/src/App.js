import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Home from './Home';
import Classe from './Classe';
import Login from './Login';
import Auth from './auth/Auth';
import makeRequiresAuth from './auth/RequiresAuth';
import Callback from './auth/Auth0Callback';


var auth = new Auth();
var requiresAuth = makeRequiresAuth(auth);
const ClasseProtected = requiresAuth(Classe);

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}
class App extends Component {

  goTo(route) {
    this.props.history.replace(`/${route}`);
  }

  componentDidMount() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      auth.renewSession();
    }
  }

  render() {
    return (
      <div>
        <div>
          I'm a header
        </div>
        <BrowserRouter>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/class">Class</Link></li>
          </ul>
          <Route exact path="/" component={() => <Home />} />
          <Route exact path="/class" component={() => <ClasseProtected />} />
          <Route path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} /> 
          }}/>
        </BrowserRouter>
        <Login auth={auth} />
      </div>
    );
  }
}

export default App;
