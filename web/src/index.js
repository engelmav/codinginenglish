import React from "react";
import ReactDOM from "react-dom";
import { main } from "./rootProd";

(async () => {
  const App = await main();
  ReactDOM.render(<App />, document.getElementById("main-grid"));
})().catch((e) => {
  console.log("Failed to load app.", e);
});
