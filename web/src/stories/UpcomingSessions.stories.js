import React from "react";
import { compose } from "../compose";
import { UpcomingSessions } from "../UpcomingSessions";
import { ModuleCard as _ModuleCard } from "../ModuleCard";
import { makeAppStore } from "../stores/AppStore";

export default {
  title: "UpcomingSessions",
  component: UpcomingSessions,
};

class MockCieApi {
  getUpcomingModulesAndSessions() {
    return {
      data: [
        {
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa porro quae animi quos accusantium esse amet! Cupiditate, corrupti. Quo velit debitis optio, vel deleniti tempore modi facilis labore. Nam.",
          id: 1,
          image_path: null,
          module_sessions: [
            { _session_datetime: "2021-04-01T19:45:39.723160", id: 1 },
            { _session_datetime: "2021-04-01T09:45:39.723160", id: 2 },
          ],
          name: "Web App Development - Basic",
        },
        {
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa porro quae animi quos accusantium esse amet! Cupiditate, corrupti. Quo velit debitis optio, vel deleniti tempore modi facilis labore. Nam.",
          id: 1,
          image_path: null,
          module_sessions: [
            { _session_datetime: "2021-04-01T19:45:39.723160", id: 1 },
            { _session_datetime: "2021-04-01T09:45:39.723160", id: 2 },
          ],
          name: "Web App Development - Intermediate",
        },
      ],
      messages: ["Successfully retried module sessions."],
    };
  }
}

const mockSettings = {
  assets: "https://cie-assets.nyc3.digitaloceanspaces.com",
};

const appStore = makeAppStore();
const cieApi = new MockCieApi();
const settings = mockSettings;
const sessionData = {
  cie_module: "1",
  session_datetime: "2/28/2021",
};
const CheckoutForm = () => <div>Fake Checkout Form!</div>
const ModuleCard = compose(_ModuleCard, { appStore, sessionData, settings, CheckoutForm });

const props = {
  cieApi,
  ModuleCard,
};

export const DefaultView = () => <UpcomingSessions {...props} />;
