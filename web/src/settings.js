/* global __ENVIRONMENT__, __DEV_SERVER__ */


const settings = {
  production: {
    auth0Host:     "https://www.codinginenglish.com/callback",
    guacUrl:       "https://remote.codinginenglish.com/guacamole",
    rocketchatUrl: "https://chat.codinginenglish.com/channel/",
    slidesUrl:     "https://slides.com/vincentengelmann",
    auth0LogoutUrl:"https://www.codinginenglish.com",
    assets:        "https://cie-assets.nyc3.digitaloceanspaces.com"

  },
  development: {
    auth0Host:     (__DEV_SERVER__ === "1") ? 'http://localhost:8080/callback': 'http://192.168.1.43/callback',
    guacUrl:       (__DEV_SERVER__ === "1") ? 'http://192.168.1.45:8080/guacamole': "https://remote.codinginenglish.com/guacamole",
    rocketchatUrl: "https://chat.codinginenglish.com/channel/",
    slidesUrl:     "https://slides.com/vincentengelmann",
    auth0LogoutUrl: (__DEV_SERVER__ === "1") ? 'http://localhost:8080/': 'http://192.168.1.43/',
    assets:        "https://cie-assets.nyc3.digitaloceanspaces.com"
  }
}

export default settings[__ENVIRONMENT__];