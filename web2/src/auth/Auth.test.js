import makeRequiresAuth from './RequiresAuth';
import Auth from './Auth';
import React, { Component } from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

test("makeRequiredAuthInjectsAuth", () => {
  const auth = new Auth();
  auth.isAuthenticated = jest.fn()
  const requiresAuth = makeRequiresAuth(auth);
  class FakeComponent extends React.Component {
    render() {
      return <h1>Yo</h1>;
    }
  }
  console.log(requiresAuth);
  const ProtectedComponent = requiresAuth(FakeComponent);
  const wrapper = shallow(<ProtectedComponent />);
  expect(auth.isAuthenticated).toHaveBeenCalled();
})