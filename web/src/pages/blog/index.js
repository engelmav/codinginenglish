import Head from "next/head";
import Layout from "../../components/Layout";
import utilStyles from "../../styles/utils.module.css";
import Link from "next/link";
import Date from "../../components/date";
import React from "react";
import { AppStoreProvider } from "../../stores/appStoreReact";
import getContent from "../../cms";
import { Article } from "../../components/layout";
import { H1 } from "../../components/typography";

import { styled } from "@linaria/react"

const BlogArticle = styled(Article)`
  padding-top: 40px;
`

const BlogTitle = styled(H1)`
  padding-top: 40px;
`

export default function BlogHome(props) {
  const { blogHomeContent, allPostsData } = props;
  console.log(allPostsData)
  return (
    <AppStoreProvider>
      <Layout {...props}>
        <BlogTitle>Coding in English Blog</BlogTitle>
            <BlogArticle>

            <p>{blogHomeContent.blurb}</p>
         
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
            </BlogArticle>
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
