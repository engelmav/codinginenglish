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
/** student data
 * 
 *   const cols = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    {
      field: "room",
      headerName: "Room",
      width: 130,
      renderCell: renderRoomDropdown,
    },
    { field: "vm", headerName: "VM" },
  ];
  const rows = [
    { id: 1, name: "Maria Elena", vm: "esp-01", room: "conscious-puma" },
    { id: 2, name: "Xavier", vm: "esp-02" },
    { id: 3, name: "Carlo", vm: "ita-03", room: "conscious-puma" },
    { id: 4, name: "Karen", vm: "usa-04" },
  ];
 */
/**
 * {'rooms': {'main': {'students': {}}}}
 */
const roomsDb = ["main", "conscious-puma", "moldy-vulture"];

const studentDb = [
  { id: 1, name: "Carlo" },
  { id: 2, name: "Xavier" },
];

let studentSessionData = { rooms: { main: { students: {} } } };

class MockInstructorApi {
  getStudentsInSession(activeSessionId) {}
  /**
   * 
   *   const cols = [
    { field: "id", headerName: "id", width: 70 },
    { field: "room", headerName: "Room", width: 130, editable: true },
    { field: "students", headerName: "students", width: 200 },
  ];
  const rows = [
    { id: 1, room: "conscious-puma", students: "Maria, Carlo" },
    { id: 2, room: "moldy-vulture", students: "Maria, Carlo" },
  ];

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
    /* HAR HAR! It's a joiner table. */
    return studentSessionData;
  }
  getRooms(activeSessionId) {
    /*
    id: roomId, name: roomName
    */
    return roomsDb;
  }
  createRoom(roomName) {
    const newId = Math.round(Math.random() * (500 - 10) + 10);
    const newRoom = { id: newId, name: roomName, students: "" };
    roomsDb.push(newRoom);
    return newRoom;
  }
  deleteRooms(roomIds) {
    roomsDb.filter((room) => {
      return !roomIds.includes(room.id);
    });
    studentSessionData = studentSessionData.filter(
      (ssd) => !roomIds.includes(ssd.roomId)
    );
    return studentSessionData;
  }

  renameRoom(roomId) {}

  addStudentToRoom(studentId, roomId) {
    /**
     * Not needed. Student is always in a room.
     */
  }
  moveStudent(studentId, toRoomId) {
    console.log("putting studentId", studentId, "to room", toRoomId);
    studentSessionData = studentSessionData.map((session) => {
      if (session.id === studentId) {
        return { ...session, roomId: toRoomId };
      } else {
        return { ...session };
      }
    });
    return studentSessionData;
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
