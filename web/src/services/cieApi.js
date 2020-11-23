import axios from 'axios';


class CieApi {
  async storeNewUser(data) {
    return await (await axios.post('/api/users', data)).data;
  }

  async _get(uri){
    // TODO: handle exceptions

  }

  async getUserRegistrations(userId) {
    console.log("getUserRegistrations() checking registrations for userId", userId);
    const res = await axios.get(`/api/users/${userId}/module-sessions`);
    console.log("cieApi.getUserRegistrations():", res);
    return res.data.data;
  }

  async registerUserToSession(userId){
    return await axios.post(`/api/users/${userId}/module-sessions`).data;
  }

  async sendPaymentConfirmation(params){
    return (await axios.put('/api/payment/confirmation', params)).data;
  }
}


const cieApi = new CieApi("/api");


export {
  cieApi
};