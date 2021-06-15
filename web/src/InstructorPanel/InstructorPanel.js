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
      rooms: computed,
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
  setSelectedStudents(students) {
    this.selectedStudents = students;
  }
  @computed get rooms() {
    return Object.keys(this.aulaConfig.rooms);
  }
  getRoomNameById(roomId) {
    const roomName = this.rooms.find((r) => r.id === roomId)?.name;
    return roomName;
  }
  setSelectedRooms(rooms) {
    console.log("setSelectedRooms:", rooms);
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
     * [ { id: number, studentName: string, vm?: link, roomName: string }, ]
     */
    const studentsOfRoom = (roomName) =>
      Object.keys(this.aulaConfig.rooms[roomName].students);
    if (!this.aulaConfig || Object.keys(this.aulaConfig).length === 0) {
      return [];
    }
    let studentId = 0;
    const getStudentsInRoom = (roomName) => {
      const students = [];
      studentsOfRoom(roomName).forEach((studentName) => {
        studentId += 1;
        students.push({
          id: studentId,
          studentName: studentName,
          roomName: roomName,
        });
      });
      return students;
    };
    let studentsInAllRooms = [];
    const roomsInAula = () => Object.keys(this.aulaConfig.rooms);
    roomsInAula().forEach((room) => {
      const studentsInRoom = getStudentsInRoom(room);
      console.log("studentsInRoom for", room, "is", studentsInRoom);
      console.log(
        "concatenating studentsInAllRooms",
        studentsInAllRooms,
        "with",
        { studentsInRoom }
      );
      studentsInAllRooms = [...studentsInAllRooms, ...studentsInRoom];
      console.log("studentsInAllRooms:", studentsInAllRooms);
    });
    return studentsInAllRooms;
  }
  @computed get roomGridData() {
    /**
     * "takes"
     * [ { id: number, studentId: number, roomId: number, vmId: link },]
     * returns
     * [ { id: number, roomName: string, students: string } ]
     */
    if (!this.aulaConfig || Object.keys(this.aulaConfig).length === 0) {
      return [];
    }
    // {'rooms': {'main': {'students': {}}}}
    const roomRows = [];
    let roomId = 0;
    Object.keys(toJS(this.aulaConfig).rooms).forEach((roomKey) => {
      roomId += 1;
      const room = this.aulaConfig.rooms[roomKey];
      const studentsInRoom = [];
      Object.keys(room.students).forEach((student) => {
        studentsInRoom.push(student);
      });
      const studentsStr =
        studentsInRoom.length > 0 ? studentsInRoom.join(", ") : "empty";
      roomRows.push(
        // { id: number, roomName: string, students: string }
        { id: roomId, roomName: roomKey, students: studentsStr }
      );
    });
    return roomRows;
  }

  studentsByRooms(rooms) {
    console.log("studentsByRooms rooms:", toJS(rooms));
    const students = [];
    rooms.forEach((roomName) => {
      const studentsObj = this.aulaConfig.rooms[roomName].students;

      Object.keys(studentsObj).forEach((studentName) => {
        const studentAndRoom = {
          studentName: studentName,
          roomName: roomName,
        };
        students.push(studentAndRoom);
      });
    });
    return students;
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
  useEffect(() => {
    async function init() {
      const aulaConfig = await instructorApi.getAulaConfig(
        appStore.activeSessionId
      );
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
        setCurrentRoom(params.row.roomName);
      }, [currentRoom]);

      const moveStudent = (e) => {
        const toRoomName = e.target.value;
        const aulaConfig = instructorApi.moveStudent(
          params.row.studentName,
          currentRoom,
          toRoomName
        );
        ipStore.setAulaConfig(aulaConfig);
      };
      return (
        <Select onChange={moveStudent}>
          <option>{currentRoom}</option>
          {ipStore.rooms
            .filter((room) => room !== currentRoom)
            .map((room) => {
              return <option value={room}>{room}</option>;
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
    { field: "studentName", headerName: "Name", width: 130 },
    {
      field: "roomName",
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
        <SmBtn
          onClick={() => {
            ipStore.newRoomName = animal.getId();
            ipStore.roomAddDialogOpen = true;
          }}
        >
          Add
        </SmBtn>
        <SmBtn
          onClick={() => {
            // Students will be orphaned. Identify them and put them into "main".
            const orphanedStudents = ipStore.studentsByRooms(
              ipStore.selectedRooms
            );
            console.log("orphanedStudents:", orphanedStudents);
            orphanedStudents.forEach((orphanedStudent) => {
              const { studentName, roomName } = orphanedStudent;
              instructorApi.moveStudent(studentName, roomName, "main");
            });

            const newAulaConfig = instructorApi.deleteRooms(
              ipStore.selectedRooms
            );
            ipStore.setAulaConfig(newAulaConfig);
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
          onS
          onSelectionModelChange={(e) => {
            const data = toJS(ipStore.roomGridData);
            const selectedIds = e.selectionModel;
            const selectedRowData = data
              .filter((row) => selectedIds.includes(row.id.toString()))
              .map((room) => room.roomName);
            ipStore.setSelectedRooms(selectedRowData);
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
          const newAulaConfig = await instructorApi.createRoom(
            appStore.activeSessionId,
            ipStore.newRoomName
          );
          console.log("newAulaConfig:");
          ipStore.setAulaConfig(newAulaConfig);
          ipStore.newRoomName = "";
          ipStore.closeAddRoomDialog();
        }}
      >
        Add
      </Button>
    </Box>
  );
});
