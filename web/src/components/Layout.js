import React from "react";
import Head from "next/head";



const Layout = (props) => {
  const { children, headerContent, footerContent } = props;
  return (
    <div>
      <Head>
        <title>coding_in_english</title>
      </Head>
      <div className="internalContainerDiv">{children}</div>
    </div>
  );
};
export default Layout;
