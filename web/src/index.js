import React, { lazy, Suspense, useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import history from "./history";
import { Router, Route } from "react-router-dom";
import { makeApp, makeLazyHeader, makeLazyFooter } from "./rootProd";
import { Home } from "./rootProd";

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

(async () => {
  ReactDOM.render(
    <Router history={history}>
      {/* <HeaderLazy /> */}
      {makeLazyComponent(makeLazyHeader)}
      <Route exact path="/" component={(props) => <Home />} />
      {makeLazyComponent(makeApp)}
      {makeLazyComponent(makeLazyFooter)}
    </Router>,
    document.getElementById("main-grid")
  );
})().catch((e) => {
  console.log("Failed to load app.", e);
});
