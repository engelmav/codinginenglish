/* global __ENVIRONMENT__, __DEV_SERVER__ */
console.log("SERVER_MODE is set to", SERVER_MODE)
const settings = {
  production: {
    auth0Redirect:     "https://www.codinginenglish.com/callback",
    cieApiUrl:         (SERVER_MODE) ? "http://cie-api": "/",
    cmsUrl:            "https://content.codinginenglish.com",
    guacUrl:           "https://remote.codinginenglish.com/guacamole",
    rocketchatUrl:     "https://chat.codinginenglish.com/channel/",
    slidesUrl:         "https://slides.com/vincentengelmann",
    auth0LogoutUrl:    "https://www.codinginenglish.com",
    assets:            "https://cie-assets.nyc3.digitaloceanspaces.com",
    edgeAssets:        "https://cie-assets.nyc3.cdn.digitaloceanspaces.com",
    stripePK:          "pk_live_ciL7BF5syCv4uC1KPjHEq2Sa00raFPFo6w",
    websocketAddress:  "wss://ws.codinginenglish.com:443/ws/stream"

  },
  development: {
    auth0Redirect:     'http://localhost:3000/callback',
    cieApiUrl:         (SERVER_MODE) ? "http://localhost:5000": "/",
    cmsUrl:            "https://content.codinginenglish.com",
    guacUrl:           (DEV_SERVER === "1") ? 'http://192.168.1.45:8080/guacamole': "https://remote.codinginenglish.com/guacamole",
    rocketchatUrl:     "https://chat.codinginenglish.com/channel/",
    slidesUrl:         "https://slides.com/vincentengelmann",
    auth0LogoutUrl:    (DEV_SERVER === "1") ? 'http://localhost:8080/': 'http://192.168.1.43/',
    assets:            "https://cie-assets.nyc3.digitaloceanspaces.com",
    edgeAssets:        "https://cie-assets.nyc3.cdn.digitaloceanspaces.com",
    stripePK:          "pk_test_cwKTnilflzQHY5WlR2x2tgwa00KGJyLRrP",
    websocketAddress:  "ws://192.168.1.156:5000/ws/stream"
  }
}

export default settings[process.env.ENVIRONMENT];
