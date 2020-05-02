import axios from 'axios';

function storeNewUser(data){
  axios.put(data);
}


export { storeNewUser };