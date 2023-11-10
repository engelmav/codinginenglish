// https://nextjs.org/docs/basic-features/built-in-css-support#adding-a-global-stylesheet
import "../styles.css";
import "tailwindcss/tailwind.css";
import { GlobalStyles } from "twin.macro";
import { Layout } from "../components/Layout";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { useEffect } from "react";
import * as gtag from "../util/gtag";
import Head from "next/head";
import { useRouter } from "next/router";
import GoogleAnalytics from "../components/googleAnalytics";
import CookieBanner from "../components/cookies";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
            }}
          />
        </Head>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        />
        <Layout>
          <GlobalStyles />
          <GoogleAnalytics GA_MEASUREMENT_ID="G-ML3KQNS5VX" />
          <Component {...pageProps} />
          <Analytics />
          <CookieBanner />
        </Layout>
    </>
  );
}
