// https://nextjs.org/docs/basic-features/built-in-css-support#adding-a-global-stylesheet
import "../styles.css";
import "tailwindcss/tailwind.css";
import { GlobalStyles } from "twin.macro";
import {Layout} from "../components/Layout";

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <GlobalStyles />
      <Component {...pageProps} />
    </Layout>
  );
}
