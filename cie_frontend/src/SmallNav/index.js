import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <header className="cie-header-sm">
        <h1 className="cie-header-text-sm">coding_in_english</h1>
        <ul className="routes__navbar-sm">
          <li><Link to="/">Modules</Link></li>
          {this.state.authData &&
            <React.Fragment>
              <li><Link to="/home">Dashboard</Link></li>
              <li onClick={() => alert()}>
                <Link to="/class">Session!</Link>
              </li>
            </React.Fragment>
          }
          <li><Login auth={auth} isAuthenticated={this.state.authData} /></li>
        </ul>
      </header>
    );
  }
}

export default Header;
