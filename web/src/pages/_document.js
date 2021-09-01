import Document, { Html, Head, Main, NextScript } from "next/document";
import React from "react";

class CieDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@700&display=swap"
            rel="stylesheet"
          />

          <link
            href="https://fonts.googleapis.com/css?family=Roboto+Mono&display"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto&display"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Noto+Sans&display"
            rel="stylesheet"
          />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-199972795-1"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag() {
                  dataLayer.push(arguments);
                }
                gtag("js", new Date());
                gtag("config", "UA-199972795-1", {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              var _iub = _iub || [];
              _iub.csConfiguration = {
                consentOnContinuedBrowsing: false,
                lang: "en",
                siteId: 2336209,
                cookiePolicyId: 48905763,
                cookiePolicyUrl: "https://www.iubenda.com/privacy-policy/48905763",
                banner: {
                  acceptButtonDisplay: true,
                  customizeButtonDisplay: true,
                  position: "float-top-center",
                  rejectButtonDisplay: true,
                },
              };`,
            }}
          />
          <script
            type="text/javascript"
            src="http://cdn.iubenda.com/cs/iubenda_cs.js"
            charset="UTF-8"
            async
          ></script>
          <script
            type="text/javascript"
            src="https://cdn.iubenda.com/iubenda.js"
            charset="UTF-8"
            async
          ></script>
        </Head>
        <body style={{ margin: 0, boxSizing: "border-box" }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CieDocument;
