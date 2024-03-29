import React, { useEffect } from "react";
import { useRouter } from "next/router";
import "@fontsource/roboto-mono";
import "@fontsource/roboto";
import "@fontsource/lato";
import '../styles/global.css'
function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag("config", "UA-199972795-1", {
        page_path: url,
      });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return <Component {...pageProps} />;
}


export default App;
