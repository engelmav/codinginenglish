import axios from "axios";

class CieApi {
  constructor() {
    const axiosConfig = {
      baseURL: "/",
    }
    this.axios = axios.create(axiosConfig)
  }
  async initializeUser(userData) {
    return await (
      await this.axios.post("/api/users", userData)
    ).data;
  }

  async createRegisteredUser(userData) {
    return this._post("/api/registered-user", userData);
  }

  async _get(uri) {
    // TODO: handle exceptions
  }

  async _post(uri, payload) {
    return (await this.axios.post(uri, payload)).data;
  }

  async getUpcomingRegistrationsByUserId(userId) {
    const res = await this.axios(
      {
        url: `/api/users/${userId}/module-sessions`,
        baseUrl: this.settings.cieApiUrl,
      },
      {
        params: { futureOnly: true },
      }
    );
    return res.data.data;
  }

  async getUpcomingModulesAndSessions() {
    let modulesAndSessions = [];
    try {
      const res = await this.axios.get("/api/cie-modules");
      modulesAndSessions = res.data;
    } catch (ex) {
      console.log("Failed to get upcoming classes.");
      console.log(ex.stack);
      return [];
    }
    return modulesAndSessions;
  }

  async registerUserToSession(userId) {
    return await this.axios.post(`/api/users/${userId}/module-sessions`).data;
  }

  async sendPaymentConfirmation(params) {
    return (await this.axios.put("/api/payment/confirmation", params)).data;
  }

  async getActiveSessionByUserId(userId) {
    return (await this.axios.get(`/api/users/${userId}/active-sessions`)).data;
  }

  async rocketchatLogin(username) {
    return (await this.axios.post(`/api/rocketchat/do-login`, { username })).data;
  }

  async updateUser(userId, userData) {
    console.log(
      "Attempting to update user with userId",
      userId,
      "and data",
      userData
    );
    return (await this.axios.patch(`/api/users/${userId}`, userData)).data;
  }

  async submitApp(appData) {
    const res = (await this.axios.post(`/api/student-application`, appData)).data;
    return res;
  }

  async setUserStatus(userId, status) {
    return await this.updateUser(userId, { status });
  }

  async getUserLocation() {
    return this._get("/api/applicant-location");
  }

  async log(message, level = "info") {
    return await this.post("/api/log", { data: { message, level } });
  }
}

const cieApi = new CieApi();

export { cieApi, CieApi };
