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
import { H1, Title } from "../../../components/typography";
import { styled } from "@linaria/react";
import remarkGfm from "remark-gfm";
import { LinkButton } from "../../../components/widgets";
import { AutoScaleImage } from "../../../UtilComponents";
import { MdArticle } from "../../../components/markdown"
import * as colors from "../../../components/colors";
import Link from "next/link"

const BlogCta = styled(LinkButton)`
  align-self: center;
  justify-self: center;
`;



const Author = styled.em`
  color: ${colors.darkGray};
`;

const makeCta = ({ node, ...props }) => (
  <BlogCta href={props.href}>{props.children[0]}</BlogCta>
);

function Post(props) {
  const { postData: postDataList } = props;
  const postData = postDataList[0];
  return (
    <AppStoreProvider>
      <Layout {...props}>
        <BlogLayout>
          <Head>
            <Title>{postData.title}</Title>
          </Head>
          <MdArticle>
            <h1 className={utilStyles.headingXl}>{postData.title}</h1>
            <div className={utilStyles.lightText}>
              <Author><Link href={postData.bioLink}>{postData.author}</Link></Author>
              <Date dateString={postData.date} />
            </div>
            <ReactMarkdown
              components={{
                h1: H1,
                img: AutoScaleImage,
                cta: makeCta,
              }}
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
            >
              {postData.body}
            </ReactMarkdown>
          </MdArticle>
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

export default Post;
