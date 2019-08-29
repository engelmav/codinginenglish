import React, { Component } from 'react';
import Login from '../Login';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import './styles.css';


class Header extends Component {
  componentDidUpdate(prevProps){
    
  }
  render() {
    const { shrinkNav, auth, authData } = this.props;
    const className = classNames('cie-header', { 'shrink-nav': shrinkNav });
    return (
      <header className={className}>
      <h1 className="cie-header-text">coding_in_english</h1>
      <ul className="routes__navbar">
        <li><Link to="/">Modules</Link></li>
        {authData &&
          <React.Fragment>
            <li><Link to="/home">Dashboard</Link></li>
            <li onClick={() => alert()}>
              <Link to="/class">Session!</Link>
            </li>
          </React.Fragment>
        }
        <li><Login auth={auth} isAuthenticated={authData} /></li>
      </ul>
    </header>
    );
  }
}

export default Header; 