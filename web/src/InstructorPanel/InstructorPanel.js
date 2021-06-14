import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Select, TextInput } from "../UtilComponents";
import animal from "animal-id";
import { DataGrid } from "@material-ui/data-grid";
import Dialog from "@material-ui/core/Dialog";
import { observer } from "mobx-react";
import { action, computed, makeObservable, observable, toJS } from "mobx";
import { Box } from "../UtilComponents/Box";

var MAIN_ROOM_ID = 1;

class InstructorPanelStore {
  students = [
    /*
    id: number, name: string, connectedAt?: time
    */
  ];
  selectedStudents = [
    /*
    id: number
    */
  ];
  rooms = [
    /*
    id: number, name: string
    */
  ];
  selectedRooms = [
    /*
    id: number
    */
  ];
  aulaConfig = {
    /*
    {'rooms': {'main': {'students': {}}}}
    */
  };
  roomAddDialogOpen = false;
  newRoomName = "";
  constructor() {
    makeObservable(this, {
      selectedStudents: observable,
      roomAddDialogOpen: observable,
      rooms: observable.deep,
      setRooms: action,
      addRoom: action,
      selectedRooms: observable,
      newRoomName: observable,
      aulaConfig: observable,
      setAulaConfig: action,
      studentGridData: computed,
    });
  }
  setStudents(students) {
    console.log("setting students to", students);
    this.students = students;
  }
  addStudent(student) {
    this.students.push(student);
  }
  // addStudentToRoom(studentId){ should not need if we return the "world" and let computeds run

  // }
  setSelectedStudents(students) {
    this.selectedStudents = students;
  }
  getStudentFromSessionDataById(studentId) {
    const foundStudent = this.aulaConfig.find(
      (studentSession) => studentSession.id === studentId
    );
    return foundStudent;
  }
  setRooms(rooms) {
    /**
     * [ { id: 1, room: "conscious-puma", students: "Maria, Carlo" }, ]
     */
    console.log("setRooms() rooms =", toJS(rooms));
    this.rooms = rooms;
  }
  addRoom(newRoom) {
    /**
     * { id: newId, name: string, students: "" };
     */
    this.rooms.push(newRoom);
  }
  deleteRooms(rooms) {
    this.rooms = this.rooms.filter((room) => !rooms.includes(room.id));
  }
  getRoomNameById(roomId) {
    const roomName = this.rooms.find((r) => r.id === roomId)?.name;
    return roomName;
  }
  setSelectedRooms(rooms) {
    this.selectedRooms = rooms;
  }
  closeAddRoomDialog = () => {
    this.roomAddDialogOpen = false;
  };
  /**
   * Takes an array of objects and converts to es6 map.
   * @param {Array<object>} studentRoomAssignments
   */
  setAulaConfig(aulaConfig) {
    /**
     * takes
     * {'rooms': {'main': {'students': {}}}}
     */

    this.aulaConfig = aulaConfig;
  }
  @computed get studentGridData() {
    /**
     * "takes"
     * [ { id: number, studentId: number, roomId: number, vmId: link },]
     * returns
     * [ { id: number, name: string, vm: link, room: string }, ]
     */
    const viewData = [];
    if (!this.aulaConfig || Object.keys(this.aulaConfig).length === 0) {
      return [];
    }
    // this.aulaConfig.forEach((studentSession) => {
    //   const studentName = this.students.find(
    //     (student) => student.id === studentSession.id
    //   )?.name;
    //   const vmLink = "";
    //   viewData.push({
    //     id: studentSession.id,
    //     name: studentName,
    //     vm: vmLink,
    //   });
    // });
    // return viewData;
  }
  @computed get roomGridData() {
    /* this is a weird and inefficient query to do on the frontend. Move to separate backend endpoint */
    /**
     * "takes"
     * [ { id: number, studentId: number, roomId: number, vmId: link },]
     * returns
     * [ { id: number, roomName: string, students: string } ]
     */
    const populatedRooms = {}; // use this to determine which rooms are empty
    const populatedViewData = [];
    if (!this.aulaConfig || Object.keys(this.aulaConfig).length === 0) {
      return [];
    }
    // {'rooms': {'main': {'students': {}}}}
    const roomRows = [];
    let roomId = 0;
    console.log("roomGridData: this.aulaConfig: ", toJS(this.aulaConfig))
    Object.keys(toJS(this.aulaConfig).rooms).forEach((roomKey) => {
      const room = this.aulaConfig.rooms[roomKey];
      const studentsInRoom = [];
      Object.keys(room.students).forEach((student) => {
        studentsInRoom.push(room.students[student].student);
      });
      roomRows.push(
        // { id: number, roomName: string, students: string }
        { id: roomId, roomName: roomKey, students: studentsInRoom.join(", ") }
      );
    });
    // this.studentSessionData.forEach((studentSession) => {
    //   const roomName = this.rooms.find(
    //     (room) => room.id === studentSession.roomId
    //   )?.name;
    //   const roomId = studentSession.roomId;
    //   if (roomId in populatedRooms) {
    //     populatedRooms[roomId]++;
    //   } else {
    //     populatedRooms[roomId] = 0;
    //   }

    //   const studentIdsInRoom = [];
    //   this.studentSessionData.forEach((sessionDataInner) => {
    //     if (sessionDataInner.roomId === studentSession.roomId)
    //       studentIdsInRoom.push(sessionDataInner.id);
    //   });
    //   const studentsInRoom = [];
    //   studentIdsInRoom.forEach((studentId) => {
    //     studentsInRoom.push(
    //       this.students.find((s) => s.id === studentId)?.name
    //     );
    //   });
    //   populatedViewData.push({
    //     id: studentSession.roomId,
    //     room: roomName,
    //     students: `(${studentsInRoom.length}) ${studentsInRoom.join(", ")}`,
    //   });
    // });

    /**
     * we accumulate a table of rooms that are already populated.
     * this way, we can look at the list of rooms and see which ones
     * are NOT populated, and append them to the end of the viewData.
     * So, how do we determine which ones are NOT populated? We'd
     * have to do a NOT IN operation. And that would look something like,
     * unpopulatedRooms = []
     * for room in rooms:
     *   if room not in populatedRooms:
     *     unpopulatedRooms.push(room)
     *
     * So we need to do this after we add the view data.
     */
    const unpopulatedViewData = [];
    this.rooms.forEach((room) => {
      if (!(room.id in populatedRooms)) {
        unpopulatedViewData.push({
          id: room.id,
          room: room.name,
          students: "empty!",
        });
      }
    });
    const viewData = populatedViewData.concat(unpopulatedViewData);
    return viewData;
  }

  studentIdsByRoomIds(roomIds) {
    const studentIds = [];
    this.aulaConfig.forEach((studentSession) => {
      roomIds.forEach((roomId) => {
        if (studentSession.roomId === roomId) {
          studentIds.push(studentSession.id);
        }
      });
    });
    return studentIds;
  }
}

const ipStore = new InstructorPanelStore();

const SmBtn = ({ children, ...props }) => (
  <Button {...props} p="1px" m="1px">
    {children}
  </Button>
);

const Border = styled.div`
  border: 1px solid black;
  border-top: none;
  background-color: white;
  height: "500";
  overflow-y: scroll;
`;

export const InstructorPanel = observer(({ appStore, instructorApi }) => {
  console.log("instructor panel  body");
  useEffect(() => {
    async function init() {
      console.log(
        "getting aula studentSessionData with activeSessionId =",
        appStore.activeSessionId
      );
      const aulaConfig = await instructorApi.getAulaConfig(
        appStore.activeSessionId
      );
      console.log("retrieved studentSessionData:", aulaConfig);
      ipStore.setAulaConfig(aulaConfig);
    }
    init();
  }, []);
  return (
    <Border>
      <b>Prep Script</b>
      <div style={{ overflow: true }}>
        <p>
          Pre-task exercise <SmBtn>Open Group Matching Exercise</SmBtn>
        </p>
      </div>
      <StudentList appStore={appStore} instructorApi={instructorApi} />
      <RoomList appStore={appStore} instructorApi={instructorApi} />
    </Border>
  );
});

const StudentList = observer(({ appStore, instructorApi }) => {
  useEffect(() => {
    async function init() {
      const connectedStudents = await instructorApi.getConnectedStudents(
        appStore.activeSessionId
      );
      ipStore.setStudents(connectedStudents);
    }
    init();
  }, []);
  const renderRoomDropdown = (params) => {
    const { id: studentId } = params;
    const RoomDropdown = observer(({ appStore, studentId, instructorApi }) => {
      const [currentRoom, setCurrentRoom] = useState(null);
      const [student, setStudent] = useState(null);
      useEffect(() => {
        console.log("RoomDropdown params", params);
        console.log("RoomDropdown searching for studentId =", studentId);
        const studentInRoom = ipStore.getStudentFromSessionDataById(studentId);
        if (!studentInRoom) return; // re-render happens after student is removed.
        console.log(
          "RoomDropdown ipStore.studentSessionData =",
          toJS(ipStore.aulaConfig)
        );
        console.log("RoomDropdown studentInRoom =", toJS(studentInRoom));
        setStudent(studentInRoom);
        setCurrentRoom(ipStore.getRoomNameById(studentInRoom.roomId));
      }, [currentRoom]);

      const moveStudent = (e) => {
        const fromRoomId = student.roomId;
        const toRoomId = e.target.value;
        const newStudentSessionData = instructorApi.moveStudent(
          studentId,
          parseInt(toRoomId)
        );
        console.log("newStudentSessionData =", newStudentSessionData);
        ipStore.setAulaConfig(newStudentSessionData);
      };
      // const currentRoom = ipStore.rooms.find((room) => student.roomId === room.id).id;
      return (
        <Select onChange={moveStudent}>
          <option>{currentRoom}</option>
          {ipStore.rooms.map((room) => {
            return <option value={room.id}>{room.name}</option>;
          })}
        </Select>
      );
    });
    return (
      <RoomDropdown
        activeSessionId={appStore.activeSessionId}
        studentId={studentId}
        instructorApi={instructorApi}
      >
        fd
      </RoomDropdown>
    );
  };

  const cols = [
    { field: "id", headerName: "ID", width: 20 },
    { field: "name", headerName: "Name", width: 130 },
    {
      field: "room",
      headerName: "Room",
      width: 130,
      renderCell: renderRoomDropdown,
    },
    { field: "vm", headerName: "VM" },
  ];

  return (
    <>
      <p>Students</p>
      <div style={{ width: "100%" }}>
        <SmBtn>Bring everyone back</SmBtn>
        {ipStore.selectedStudents.length > 1 && (
          <>
            <SmBtn>Move selected to room</SmBtn>
            <Select>
              <option>room</option>
            </Select>
          </>
        )}
        <DataGrid
          autoHeight
          density="compact"
          disableSelectionOnClick
          rows={toJS(ipStore.studentGridData)}
          columns={cols}
          checkboxSelection
          onSelectionModelChange={(e) => {
            ipStore.setSelectedStudents(e.selectionModel);
          }}
          rowsPerPageOptions={[]}
        />
      </div>
    </>
  );
});

const RoomList = observer(({ appStore, instructorApi }) => {
  const cols = [
    { field: "id", headerName: "id", width: 20 },
    { field: "roomName", headerName: "Room", width: 130, editable: true },
    { field: "students", headerName: "students", width: 200 },
  ];

  useEffect(() => {
    async function init() {
      const rooms = await instructorApi.getRooms(appStore.activeSessionId);
      ipStore.setRooms(rooms);
    }
    init();
  }, []);

  return (
    <>
      <p>Rooms</p>
      <div style={{ width: "100%" }}>
        <SmBtn onClick={() => (ipStore.roomAddDialogOpen = true)}>Add</SmBtn>
        <SmBtn
          onClick={() => {
            // Students will be orphaned. Identify them and put them into "main".
            const orphanIds = ipStore.studentIdsByRoomIds(
              ipStore.selectedRooms
            );
            orphanIds.forEach((orphanId) =>
              instructorApi.moveStudent(orphanId, MAIN_ROOM_ID)
            );
            const newStudentSessionData = instructorApi.deleteRooms(
              ipStore.selectedRooms
            );
            ipStore.deleteRooms(ipStore.selectedRooms);
            ipStore.setAulaConfig(newStudentSessionData);
          }}
          disabled={
            ipStore.selectedRooms.length === 0 || ipStore.rooms.length === 1
          }
        >
          Delete
        </SmBtn>
        <DataGrid
          autoHeight
          density="compact"
          rows={toJS(ipStore.roomGridData)}
          columns={cols}
          checkboxSelection
          onSelectionModelChange={(e) => {
            ipStore.setSelectedRooms(e.selectionModel);
          }}
          rowsPerPageOptions={[]}
        />
      </div>
      <Dialog open={ipStore.roomAddDialogOpen}>
        <NewRoomDialog appStore={appStore} instructorApi={instructorApi} />
      </Dialog>
    </>
  );
});

const NewRoomDialog = observer(({ appStore, instructorApi }) => {
  useEffect(() => {
    ipStore.newRoomName = animal.getId();
  }, []);
  return (
    <Box display="flex" flexDirection="column">
      <h1>New Room Name</h1>
      <TextInput
        onChange={(e) => {
          console.log("Setting newRoomName:", e.target.value);
          ipStore.newRoomName = e.target.value;
        }}
        value={ipStore.newRoomName}
      />
      <Button
        onClick={() => {
          ipStore.closeAddRoomDialog();
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={async () => {
          const newRoom = await instructorApi.createRoom(
            appStore.activeSessionId,
            ipStore.newRoomName
          );
          console.log("newRoom created:", newRoom);
          ipStore.addRoom(newRoom);
          ipStore.newRoomName = "";
          ipStore.closeAddRoomDialog();
        }}
      >
        Add
      </Button>
    </Box>
  );
});
