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
  const [headerHeight, setHeaderHeight] = useState(null);
  const handleSetHeaderHeight = (height) => {
    console.log("setting headerHeight to", height)
    setHeaderHeight(height)
  }

  const value = useMemo(() => [headerHeight, handleSetHeaderHeight], [headerHeight]);
  return <AppContext.Provider value={value} {...props} />;
}

export { AppStoreProvider, useAppStore };
