import React, { lazy, Suspense, useState, useEffect, Component } from "react";
import { render, hydrate } from "react-dom";
import history from "./history";
import { Router, Route } from "react-router-dom";
import { makeApp, Home, Header, Footer } from "./rootProd";
import { Spinner } from "./UtilComponents";

/**
 * The purpose of MainApp is to allow the other components to lazily
 * initialize, and prioritize everything _outside_ of this component.
 */

console.log("index.js");

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
    return (
      <>
        <Suspense fallback={<div>Loading</div>}>
          {ComponmentLazyState && ComponmentLazyState}
        </Suspense>
      </>
    );
  };
  return <Component />;
}

const App = makeApp();

const AppContainer = () => {
  console.log("App component");
  return (
    <Router history={history}>
      <Suspense fallback={<Spinner />}>
      {/* <HeaderLazy /> */}
      {/* {makeLazyComponent(makeLazyHeader)} */}
      <Header />
      <Route exact path="/" component={(props) => <Home />} />
      <App />
      <Footer />
      </Suspense>
    </Router>
  );
};

const rootElement = document.getElementById("main-grid");
if (rootElement.hasChildNodes()) {
  console.log("hydrating");
  hydrate(<AppContainer />, rootElement);
} else {
  console.log("rendering");

  render(<AppContainer />, rootElement);
}
