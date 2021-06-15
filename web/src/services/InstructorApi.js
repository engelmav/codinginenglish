import axios from "axios";

class InstructorApi {
  async _call(payload) {
    const resp = await axios.post("/aula/call", payload);
    console.log("result of call", payload, "is", resp);
    return resp.data.data;
  }
  async getConnectedStudents(activeSessionId) {
    const resp = await axios.get("/aula/students", {
      params: { activeSessionId },
    });
    console.log("resp of /aula/students is", resp);
    return resp.data.data;
  }

  async createRoom(activeSessionId, roomName) {
    const command = [
      {
        method: "aula.create_room",
        params: [activeSessionId, roomName],
      },
    ];
    return await this._call(command);
  }
  async moveStudent(studentName, fromRoomName, toRoomName) {
    const command = [
      {
        method: "aula.move_student",
        params: [studentName, fromRoomName, toRoomName],
      },
    ];
    return await this._call(command);
  }
  async getRooms(activeSessionId) {
    return await this._call([
      {
        method: "aula.get_rooms",
        params: [activeSessionId],
      },
    ]);
  }
  async getAulaConfig(activeSessionId) {
    console.log("in getBreakoutConfig");
    const resp = await this._call([
      {
        method: "aula.get_aula_config",
        params: [activeSessionId],
      },
    ]);
    return resp;
  }
}

export { InstructorApi };
