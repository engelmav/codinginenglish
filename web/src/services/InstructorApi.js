import axios from "axios";

class InstructorApi {
  async _call(payload) {
    console.log(
      "issuing call to /aula/call with payload",
      JSON.stringify(payload)
    );
    let resp;
    try {
       resp = await axios.post("/aula/call", payload);
    } catch  (error) {
      const { response } = error;
      const { request, ...errorObject } = response; // take everything but 'request'
      console.log("backend call failed with error:", errorObject);
    }
    
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

  async createRoom(activeSessionId, roomName, slug) {
    const command = [
      {
        method: "aula.create_room",
        params: [activeSessionId, roomName, slug],
      },
    ];
    return await this._call(command);
  }
  async moveStudent(activeSessionId, studentId, fromRoomName, toRoomName) {
    const command = [
      {
        method: "aula.move_student",
        params: [activeSessionId, studentId, fromRoomName, toRoomName],
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
  async deleteRooms(activeSessionId, rooms) {
    return await this._call([
      {
        method: "aula.delete_rooms",
        params: [activeSessionId, rooms]
      }
    ])
  }
  async getAulaConfig(activeSessionId) {
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
