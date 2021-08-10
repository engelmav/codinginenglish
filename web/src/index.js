import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import history from "./history";
import { Router, Route } from "react-router-dom";
import { makeApp, Home, Header, Footer } from "./rootProd";

/**
 * The purpose of MainApp is to allow the other components to lazily
 * initialize, and prioritize everything _outside_ of this component.
 */

function makeLazyComponent(asyncGetter) {
  const Component = () => {
    const [ComponmentLazyState, setComponmentLazyState] = useState(null);
    useEffect(() => {
      async function init() {
        const ReadyComponent = await asyncGetter();
        setComponmentLazyState(<ReadyComponent />);
      }
      init();
    }, []);
    return <>{ComponmentLazyState && ComponmentLazyState}</>;
  };
  return <Component />;
}

const AppContainer = () => {
  return (
    <Router history={history}>
      <Header />
      <Route exact path="/" component={(props) => <Home />} />
      {makeLazyComponent(makeApp)}
      <Footer />
    </Router>
  );
};

const rootElement = document.getElementById("main-grid");
render(<AppContainer />, rootElement);

