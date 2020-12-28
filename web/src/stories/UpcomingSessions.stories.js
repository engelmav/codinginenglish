import React from 'react';
import {compose}  from '../compose';
import { UpcomingSessions } from '../UpcomingSessions';
// import { ModuleCard as _ModuleCard } from '../ModuleCard';
import { AppStore } from '../stores/AppStore';

export default {
  title: 'UpcomingSessions',
  component: UpcomingSessions
};

class MockCieApi {
  scheduledSessions() {
    return [
      'thing'
    ];
  }
}

const mockSettings = {
  assets: "some-url"
}

const appStore = new AppStore();
const cieApi = new MockCieApi();
const settings = mockSettings;
const sessionData = {
  cie_module: "1",
  session_datetime: "2/28/2021"
};
// const ModuleCard = compose(
//   _ModuleCard,
//   { appStore, sessionData, settings }
// );

const ModuleCard = () => <div>nothing</div>

const props = {
  cieApi,
  ModuleCard
}

export const DefaultView = () =>
  <UpcomingSessions {...props} />