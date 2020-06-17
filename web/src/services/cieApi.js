import axios from 'axios';


function storeNewUser(data) {
  return axios.post('/api/users', data);
}


function userRegistrations(userId) {
  return axios.get(`/api/users/${userId}/module-sessions`);
}


export {
  storeNewUser,
  userRegistrations
};