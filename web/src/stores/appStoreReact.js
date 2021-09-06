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
  const [footerHeight, setFooterHeight] = useState(null);
  const [footerRef, setFooterRef] = useState(null);
  const handleSetHeaderHeight = (height) => {
    console.log("setting headerHeight to", height);
    setHeaderHeight(height);
  };

  const handleSetFooterHeight = (height) => {
    console.log("setting footerHeight to", height);
    setFooterHeight(height);
  };
  const providerValue = useMemo(
    () => ({
      headerHeight,
      handleSetHeaderHeight,
      footerHeight,
      handleSetFooterHeight,
      footerRef,
      setFooterRef
    }),
    headerHeight,
    footerHeight,
    footerRef
  );
  return <AppContext.Provider value={providerValue} {...props} />;
}

export { AppStoreProvider, useAppStore };
