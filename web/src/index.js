import React from 'react';
import ReactDOM from 'react-dom';
import { main } from './rootProd';
import { makeAppStore } from "./stores/AppStore";
import * as serviceWorker from './serviceWorker';

(async () => {
  const appStore = makeAppStore();
  await appStore.rehydrate();
  console.log("completed hydration:", appStore)
  const App = main(appStore);
  ReactDOM.render(<App />, document.getElementById('main-grid'));
})().catch(e => {
  console.log("Failed to load app.");
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
