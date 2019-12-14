import React, { Component } from 'react';
import Login from '../Login';
import { Link, Route, Switch } from 'react-router-dom';
import classNames from 'classnames';
import './styles.css';


class Header extends Component {

  render() {
    const {
      auth,
      authData
    } = this.props;
    const className = classNames('cie-header');

    const links = (
      <ul className="routes__navbar">
        <li><Link to="/">classes</Link></li>
        {authData &&
          <React.Fragment>
            <li><Link to="/my-dashboard">my_dashboard</Link></li>
            <li onClick={() => alert()}>
              <Link to="/class">in_session!</Link>
            </li>
          </React.Fragment>
        }
        <li><Login auth={auth} isAuthenticated={authData} /></li>
      </ul>
    );

    return (
      <Switch>
        <Route path="/class"><div></div></Route>
        <Route path="*">
          <header className={className}>
            <h1 className="cie-header-text">coding_in_english</h1>
            {links}
          </header>
        </Route>
      </Switch>
    );
  }
}

export default Header; 