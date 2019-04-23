import { googleStoredTokenId, setAuthHeaderOnAxios } from './auth'
import constants from './constants';
import 'jest-localstorage-mock';
import mockAxios from 'jest-mock-axios';


test("time-namespace-localStorage", () => {
  const KEY = `cie.${constants.LOCAL_STORAGE_DATE}.token_id`,
    VALUE = "Beetlejuice!";
  localStorage.setItem(KEY, VALUE);
  const storedLoc = googleStoredTokenId();
  expect(storedLoc).toEqual(VALUE);
});

test("auth-header-added", () => {
    const axios = setAuthHeaderOnAxios(mockAxios);
    // requesting data from server
    let _ = axios.post('/whatever/', { data: "hello" });
 
    // converting server response to upper case
    let lastReqInfo = axios.lastReqGet();
    console.log(lastReqInfo.headers);
})