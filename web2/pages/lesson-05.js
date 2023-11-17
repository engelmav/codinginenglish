

import { MDXProvider } from "@mdx-js/react";
import MyMDXPage from "./my-mdx-page.mdx";

export default function About() {
  return (
    <div style={{ padding: "60px" }}>

      <MDXProvider>
        <MyMDXPage />
      </MDXProvider>{" "}
    </div>
  );
}


