import axios from 'axios';
import constants from './constants';

const fetchClient = () => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };

  // Create instance
  let instance = axios.create(defaultOptions);

  // Set the AUTH token for any request
  instance.interceptors.request.use(config => {
    const token = googleStoredTokenId();
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
    return config;
  });

  return instance;
};

function setAuthHeaderOnAxios(axiosInstance){
  axiosInstance.defaults.headers.common['Authorization'] = googleStoredTokenId();
  // or
  axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem("cie.20190423.token_id");
    config.headers.Authorization =  token;
    return config;
  });
  return axiosInstance;
}

function googleStoredTokenId(){
  return localStorage.getItem(`cie.${constants.LOCAL_STORAGE_DATE}.token_id`);
}

export { googleStoredTokenId, fetchClient };