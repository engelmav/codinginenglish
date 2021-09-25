import Head from "next/head";
import Image from "next/image";
import styles from "./bloglayout.module.css";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import React from "react";


export const siteTitle = "Coding in English - Blog";

export default function BlogLayout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Coding in English Blog!"
        />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <header className={styles.header}>
       
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/blog">
            <a>← Back to blog home</a>
          </Link>
        </div>
      )}
    </div>
  );
}
