import Head from "next/head";
import BlogLayout, { siteTitle } from "../../components/BlogLayout";
import Layout from "../../components/Layout";
import utilStyles from "../../styles/utils.module.css";
import Link from "next/link";
import Date from "../../components/date";
import React from "react";
import { AppStoreProvider } from "../../stores/appStoreReact";
import getContent from "../../cms";

export default function BlogHome(props) {
  const { blogHomeContent, allPostsData } = props;
  console.log(allPostsData)
  return (
    <AppStoreProvider>
      <Layout {...props}>
        <BlogLayout home>
          <Head>
            <title>{siteTitle}</title>
          </Head>
          <section className={utilStyles.headingMd}>
            <p>{blogHomeContent.blurb}</p>
          </section>
          <section
            className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}
          >
            <h2 className={utilStyles.headingLg}>
              {blogHomeContent.entriesTitle}
            </h2>
            <ul className={utilStyles.list}>
              {allPostsData &&
                allPostsData.map(({ id, date, title, slug }) => {
                  return (
                    <li className={utilStyles.listItem} key={id}>
                      <Link href={`/blog/posts/${slug}`}>
                        <a>{title}</a>
                      </Link>
                      <br />
                      <small className={utilStyles.lightText}>
                        <Date dateString={date} />
                      </small>
                    </li>
                  );
                })}
            </ul>
          </section>
        </BlogLayout>
      </Layout>
    </AppStoreProvider>
  );
}

export async function getStaticProps({ locale }) {
  const allPostsData = await getContent(locale, "blog-entries");
  const blogHomeContent = await getContent(locale, "blog-home");
  const headerContent = await getContent(locale, "header");
  const footerContent = await getContent(locale, "footer");
  return {
    props: {
      blogHomeContent,
      allPostsData,
      headerContent,
      footerContent,
    },
  };
}
