import axios from 'axios';


class CieApi {
  async storeNewUser(data) {
    return await (await axios.post('/api/users', data)).data;
  }

  async getUserRegistrations(userId) {
    const res = await axios.get(`/api/users/${userId}/module-sessions`).data;
    console.log("cieApi.getUserRegistrations():", res)
    return res.data;
  }

  async registerUserToSession(userId){
    return await axios.post(`/api/users/${userId}/module-sessions`).data;
  }

  async sendPaymentConfirmation(params){
    return (await axios.put('/api/payment/confirmation', params)).data;
  }
}


const cieApi = new CieApi();


export {
  cieApi
};