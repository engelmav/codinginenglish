import React from 'react';

export const compose = (Component, dependsToInject) => {
  return class InjectedHOC extends React.Component {
    render() {
      return (
        <Component {...dependsToInject} {...this.props}/>
      );
    }
  };
};
