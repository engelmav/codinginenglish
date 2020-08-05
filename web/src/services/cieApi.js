import axios from 'axios';



class CieApi {
  async storeNewUser(data) {
    return await axios.post('/api/users', data);
  }
  async userRegistrations(userId) {
    return await axios.get(`/api/users/${userId}/module-sessions`);
  }
  async registerUserToSession(userId){
    return await axios.post(`/api/users/${userId}/module-sessions`);
  }
}

const cieApi = new CieApi();


export {
  cieApi
};