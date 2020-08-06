import axios from 'axios';


class CieApi {
  async storeNewUser(data) {
    return await (await axios.post('/api/users', data)).data;
  }
  async getUserRegistrations(userId) {
    return await axios.get(`/api/users/${userId}/module-sessions`);
  }
  async registerUserToSession(userId){
    return await axios.post(`/api/users/${userId}/module-sessions`);
  }

  async sendPaymentConfirmation(params){
    return (await axios.put('/api/payment/confirmation', params)).data;
  }
}

const cieApi = new CieApi();


export {
  cieApi
};