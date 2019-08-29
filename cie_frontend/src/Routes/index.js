import React, { Component } from 'react';

class Routes extends Component {
  render() {
    return (
      <>
        <Route exact path="/" component={(props) => <Welcome auth={auth} authData={this.state.authData} {...props} />} />
        <Route exact path="/home" component={(props) => <Home auth={auth} authData={this.state.authData} {...props} />} />
        <Route exact path="/class" component={(props) => {
          return <ClassRoomProtected authData={this.state.authData} {...props} />;
        }} />
        }
      <Route path="/callback" render={(props) => {
          handleAuthentication(props, this.setIsAuthenticated);
          return <CallbackWithRouter {...props} />
        }} />
      </>
    );
  }
}

export default Routes;