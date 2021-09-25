import React from "react";
import BlogLayout from "../../../components/BlogLayout";
import Layout from "../../../components/Layout";
import Head from "next/head";
import Date from "../../../components/date";
import utilStyles from "../../../styles/utils.module.css";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { AppStoreProvider } from "../../../stores/appStoreReact";
import getContent from "../../../cms";

export default function Post(props) {
  const { postData: postDataList } = props;
  const postData = postDataList[0];
  return (
    <AppStoreProvider>
      <Layout {...props}>
        <BlogLayout>
          <Head>
            <title>{postData.title}</title>
          </Head>
          <article>
            <h1 className={utilStyles.headingXl}>{postData.title}</h1>
            <div className={utilStyles.lightText}>
              <Date dateString={postData.date} />
            </div>
            <ReactMarkdown escapeHtml={false} rehypePlugins={[rehypeRaw]}>
              {postData.body}
            </ReactMarkdown>
          </article>
        </BlogLayout>
      </Layout>
    </AppStoreProvider>
  );
}

export async function getStaticPaths({ locales }) {
  const url = `https://content.codinginenglish.com/blog-entries`;
  const res = await fetch(url);
  const posts = await res.json();
  let paths = [];
  posts.forEach((post) => {
    for (const locale of locales) {
      paths.push({
        params: {
          slug: post.slug,
        },
        locale,
      });
    }
  });
  return {
    paths,
    fallback: false, // "we don't need nextjs at runtime"
  };
}

export async function getStaticProps(context) {
  const { locale, params } = context;
  const url = `https://content.codinginenglish.com/blog-entries?_locale=${locale}&slug=${params.slug}`;
  const res = await fetch(url);
  const postData = await res.json();

  const headerContent = await getContent(locale, "header");
  const footerContent = await getContent(locale, "footer");
  return {
    props: {
      postData,
      headerContent,
      footerContent,
    },
  };
}
