import React from 'react';
import { compose } from '../compose';
import { AppStore } from '../stores/AppStore';
import { ModuleCard as _ModuleCard } from '../ModuleCard';

const mockSettings = {
  assets: "some-url"
}

class MockCieApi {
  scheduledSessions() {
    return [
      'thing'
    ];
  }
}

const appStore = new AppStore();
const cieApi = new MockCieApi();
const settings = mockSettings;
const sessionData = {
  cie_module: "1",
  session_datetime: "2/28/2021"
};

const CheckoutForm = () =>
  <div>I am a nonsense checkout form</div>;

const ModuleCard = compose(
  _ModuleCard,
  {
    appStore,
    sessionData,
    settings,
    CheckoutForm
  }
);


export default {
  title: 'ModuleCard',
  component: ModuleCard,
};

export const DefaultView = () =>
  <ModuleCard />