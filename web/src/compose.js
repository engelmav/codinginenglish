import React from 'react';

const compose = (Component, dependsToInject) => {
  return class InjectedHOC extends React.Component {
    render() {
      return (
        <Component {...dependsToInject} {...this.props}/>
      );
    }
  };
};

export { compose };