import Document, { Html, Head, Main, NextScript } from "next/document";
import React from "react";

class CieDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
        <meta property="og:image" content="https://cie-assets.nyc3.cdn.digitaloceanspaces.com/cie-facebook-profile-pic-500px.png" />
        
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
            charSet="UTF-8"
            async
          ></script>
          <script
            type="text/javascript"
            src="https://cdn.iubenda.com/iubenda.js"
            charSet="UTF-8"
            async
          ></script>
          
    <script dangerouslySetInnerHTML={{
              __html: `
      // Initialize and add the map
      function initMap() {
        // The location of Uluru
        const uluru = { lat: -25.344, lng: 131.036 };
        // The map, centered at Uluru
        const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 4,
          center: uluru,
        });
        // The marker, positioned at Uluru
        const marker = new google.maps.Marker({
          position: uluru,
          map: map,
        });
      }`}}
      >
    </script>

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
