import { googleStoredTokenId, setAuthHeaderOnAxios } from './auth'
import constants from './constants';
import 'jest-localstorage-mock';


test("time-namespace-localStorage", () => {
  const KEY = `cie.${constants.LOCAL_STORAGE_DATE}.token_id`,
    VALUE = "Beetlejuice!";
  localStorage.setItem(KEY, VALUE);
  const storedLoc = googleStoredTokenId();
  expect(storedLoc).toEqual(VALUE);
});