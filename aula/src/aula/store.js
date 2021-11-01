import React, { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext();

function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(`useAppStore must be used within AppStoreProvider`);
  }
  return context;
}

function AppStoreProvider(props) {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [footerHeight, setFooterHeight] = useState(null);


/*
    this.state = {
      activityData: [],
      aulaWebsocket: null,
      guacWindow: true,
      chatWindow: true,
      slidesWindow: true,
      videoWindow: true,
      instructorPanel: true,
      popupActivityWindow: false,
      isWindowDragging: false,

      rocketchatAuthToken: null,
      chatChannel: null,
      videoChannel: null,
      prezzieLink: null,
      exerciseContent: null,
      onTop: null,
      browserDetect,

      roomChangeNotification: null,
    };
*/



  const providerValue = useMemo(
    () => ({
      currentRoom,
      setCurrentRoom,
    }),
    currentRoom,
    setCurrentRoom
  );
  return <AppContext.Provider value={providerValue} {...props} />;
}

export { AppStoreProvider, useAppStore };
