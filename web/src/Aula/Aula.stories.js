import React from "react";
import { Aula as _Aula } from ".";
import { compose } from "../compose";
import { makeAppStore } from "../stores/AppStore";
import { BrowserRouter as Router } from "react-router-dom";
import { InstructorPanel as _InstructorPanel } from "../InstructorPanel/InstructorPanel";

export default {
  title: "Views/Aula",
  component: Aula,
};

class MockCieApi {
  getActiveSessionByUserId() {
    return { data: { id: 1 } };
  }
}

const settings = {
  auth0Host: "https://www.codinginenglish.com/callback",
  guacUrl: "https://remote.codinginenglish.com/guacamole",
  rocketchatUrl: "https://chat.codinginenglish.com/channel/",
  slidesUrl: "https://slides.com/vincentengelmann",
  auth0LogoutUrl: "https://www.codinginenglish.com",
  assets: "https://cie-assets.nyc3.digitaloceanspaces.com",
};

const appStore = makeAppStore("aula_story");
appStore.firstName = "Marc";
appStore.setUserRole("instructor");
const roomsDb = ["main", "conscious-puma", "moldy-vulture"];

let aulaConfig = {
  rooms: {
    main: { students: { Carlo: {}, Xavier: {} } },
    "conscious-puma": { students: {} },
  },
};

class MockInstructorApi {
  getStudentsInSession(activeSessionId) {}
  /**
   * 
   * @param {*} activeSessionId 
   * @returns 
   */
  getConnectedStudents(activeSessionId) {
    return [
      { id: 1, name: "Carlo", connectedAt: "" },
      { id: 2, name: "Xavier" },
      { id: 3, name: "Karen" },
      { id: 4, name: "Alberto" },
    ];
  }
  getAulaConfig(activeSessionId) {
    return aulaConfig;
  }
  getRooms(activeSessionId) {
    return roomsDb;
  }
  createRoom(activeSessionId, roomName) {
    aulaConfig.rooms[roomName] = { students: {} }
    return aulaConfig;
  }
  deleteRooms(roomName) {
    delete aulaConfig.rooms[roomName]
    return aulaConfig;
  }

  renameRoom(roomId) {}

  addStudentToRoom(studentId, roomId) {
    /**
     * Not needed. Student is always in a room.
     */
  }
  moveStudent(studentName, fromRoomName, toRoomName) {
    console.log("MockInstructorApi.moveStudent: fromRoomName", fromRoomName)
    delete aulaConfig.rooms[fromRoomName].students[studentName];
    aulaConfig.rooms[toRoomName].students[studentName] = {};
    return aulaConfig;
  }
}

const instructorApi = new MockInstructorApi();
const InstructorPanel = compose(_InstructorPanel, { appStore, instructorApi });

const cieApi = new MockCieApi();

const Aula = compose(_Aula, {
  appStore,
  cieApi,
  settings,
  InstructorPanel,
});

import { createBrowserHistory } from "history";
const history = createBrowserHistory();
const fakeHistory = { location: "/" };
console.log("this is the history:");
export const DefaultView = () => (
  <Router location={fakeHistory}>
    <Aula />
  </Router>
);
