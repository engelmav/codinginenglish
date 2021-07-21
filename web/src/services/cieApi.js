import axios from "axios";

class CieApi {
  async initializeUser(userData) {
    return await (await axios.post("/api/users", userData)).data;
  }

  async createRegisteredUser(userData){
    return this._post("/api/registered-user", userData)
  }

  async _get(uri) {
    // TODO: handle exceptions
  }

  async _post(uri, payload) {
    return (await axios.post(uri, payload)).data;
  }

  async getUpcomingRegistrationsByUserId(userId) {
    console.log(
      "getUserRegistrations() checking registrations for userId",
      userId
    );
    const res = await axios.get(`/api/users/${userId}/module-sessions`, {
      params: { futureOnly: true },
    });
    console.log("cieApi.getUserRegistrations():", res);
    return res.data.data;
  }

  async getUpcomingModulesAndSessions() {
    let modulesAndSessions = [];
    try {
      const res = await axios.get("/api/cie-modules");
      modulesAndSessions = res.data;
    } catch (ex) {
      console.log("Failed to get upcoming classes.");
      console.log(ex.stack);
      return [];
    }
    return modulesAndSessions;
  }

  async registerUserToSession(userId) {
    return await axios.post(`/api/users/${userId}/module-sessions`).data;
  }

  async sendPaymentConfirmation(params) {
    return (await axios.put("/api/payment/confirmation", params)).data;
  }

  async getActiveSessionByUserId(userId) {
    return (await axios.get(`/api/users/${userId}/active-sessions`)).data;
  }

  async rocketchatLogin(username) {
    return (await axios.post(`/api/rocketchat/do-login`, { username })).data;
  }

  async updateUser(userId, userData) {
    console.log(
      "Attempting to update user with userId",
      userId,
      "and data",
      userData
    );
    return (await axios.patch(`/api/users/${userId}`, userData)).data;
  }

  async submitApp(appData) {
    return (await axios.post(`/api/student-application`, appData)).data;
  }

  async setUserStatus(userId, status) {
    return await this.updateUser(userId, { status });
  }

  async getUserLocation(){
    return this._get("/api/applicant-location");
  }


  async log(message, level = "info") {
    return await this.post("/api/log", { data: { message, level } });
  }
}

const cieApi = new CieApi("/api");

export { cieApi, CieApi };
