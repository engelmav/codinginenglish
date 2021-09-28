import Document, { Html, Head, Main, NextScript } from "next/document";
import React from "react";
import { getCssText } from "../stitches.config";

const iubendaConfig = `<script type="text/javascript">
var _iub = _iub || [];
_iub.csConfiguration = {"consentOnContinuedBrowsing":false,"ccpaAcknowledgeOnDisplay":true,"lang":"en","siteId":2336209,"enableCcpa":true,"countryDetection":true,"cookiePolicyId":48905763,"cookiePolicyUrl":"https://www.iubenda.com/privacy-policy/48905763", "banner":{ "acceptButtonDisplay":true,"customizeButtonDisplay":true,"rejectButtonDisplay":true,"position":"float-top-center" }};
</script>
<script type="text/javascript" src="//cdn.iubenda.com/cs/ccpa/stub.js"></script>
<script type="text/javascript" src="//cdn.iubenda.com/cs/iubenda_cs.js" charset="UTF-8" async></script>`;

class CieDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta
            property="og:image"
            content="https://cie-assets.nyc3.cdn.digitaloceanspaces.com/cie-facebook-profile-pic-500px.png"
          />
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
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
        </Head>
        <body style={{ margin: 0, boxSizing: "border-box" }}>
          <Main />
          <NextScript />
          <div dangerouslySetInnerHTML={{ __html: iubendaConfig }}></div>
        </body>
      </Html>
    );
  }
}

export default CieDocument;
