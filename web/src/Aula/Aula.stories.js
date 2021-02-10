import React from "react";
import { Aula as _Aula } from ".";
import { compose } from '../compose';

export default {
  title: "Views/Aula",
  component: Aula,
};

class MockCieApi {}

const settings = {
  auth0Host: "https://www.codinginenglish.com/callback",
  guacUrl: "https://remote.codinginenglish.com/guacamole",
  rocketchatUrl: "https://chat.codinginenglish.com/channel/",
  slidesUrl: "https://slides.com/vincentengelmann",
  auth0LogoutUrl: "https://www.codinginenglish.com",
  assets: "https://cie-assets.nyc3.digitaloceanspaces.com",
};

const cieApi = new MockCieApi();
const Aula = compose(_Aula, {
  cieApi,
  settings,
});


export const DefaultView = () =>
  <Aula />
