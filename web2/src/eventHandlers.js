import appStoreLazy from "./stores/AppStoreLazy";
import { cieApi } from "./services/cieApi";
import Router from "next/router";

export async function handleAuthSuccess(authResult) {
  const appStore = await appStoreLazy.load();
  const initializedUser = await cieApi.initializeUser(authResult);
  appStore.user = initializedUser;
  const userData = initializedUser.data.user;
  appStore.configureUser(
    authResult,
    userData,
    initializedUser.data.rocketchat_auth_token
  );
  // TODO: re-wire with singletons
  // const websocket = await websocketManager.createWebsocket(
  //   `ws-general-user-${appStore.userId}`
  // );
  // const studentSessionMgr = new StudentSessionManager(websocket);
  // studentSessionMgr.addOnSessionStart(appStore.setSessionInProgress);
  // appStore.setSessionInProgress(initializedUser.data.has_session_in_progress);
  // // studentSessionMgr.initialize();
  let nextPage = "/my-dashboard";
  if (appStore.flow === "newRegistration") {
    nextPage = "/apply/next-steps";
  }
  Router.push(nextPage);
}
