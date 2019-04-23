import axios from 'axios';
import constants from './constants';


function setAuthHeaderOnAxios(axiosInstance){
  axiosInstance.defaults.headers.common['Authorization'] = googleStoredTokenId();
  return axiosInstance;
}


axios.interceptors.request.use(config => {
  const token = localStorage.getItem("cie.20190423.token_id");
  config.headers.Authorization =  token;
  return config;
});

function googleStoredTokenId(){
  return localStorage.getItem(`cie.${constants.LOCAL_STORAGE_DATE}.token_id`);
}

export { googleStoredTokenId, setAuthHeaderOnAxios };