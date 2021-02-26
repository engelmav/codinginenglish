import axios from "axios";

class CieApi {
  async initializeUser(data) {
    return await (await axios.post("/api/users", data)).data;
  }

  async _get(uri) {
    // TODO: handle exceptions
  }

  async getFutureUserRegistrations(userId) {
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

  async getUpcomingSessions() {
    let scheduledSessions = [];
    try {
      const res = await axios.get("/api/module-sessions");
      scheduledSessions = res.data;
    } catch (ex) {
      console.log("Failed to get upcoming classes.");
      console.log(ex.stack);
      return [];
    }
    return scheduledSessions;
  }

  async registerUserToSession(userId) {
    return await axios.post(`/api/users/${userId}/module-sessions`).data;
  }

  async sendPaymentConfirmation(params) {
    return (await axios.put("/api/payment/confirmation", params)).data;
  }
}

const cieApi = new CieApi("/api");

export { cieApi, CieApi };
