import React from "react";
import Layout from "../components/Layout";
import getContent from "../cms";
import { AppStoreProvider } from "../stores/appStoreReact";
import ReactMarkdown from "react-markdown";
import { H1, H2, Title, smFont } from "../components/typography";
import { MdArticle } from "../components/markdown";
import { styled } from "@linaria/react"

const H1Faq = styled(H1)`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`


const FAQ = (props) => {
  const { faqContent } = props;
  return (
    <AppStoreProvider>
      <Layout {...props}>

        <H1>{faqContent.title}</H1>
        <MdArticle>
        <ReactMarkdown
          components={{
            h1: H1Faq,
            // img: AutoScaleImage,
            // cta: makeCta,
          }}
        >
          {faqContent.FaqContent}
        </ReactMarkdown>
        </MdArticle>
      </Layout>
    </AppStoreProvider>
  );
};

// This gets called on every request
export async function getStaticProps(params) {
  let locale = params?.locale;
  if (locale === undefined || locale === null) {
    locale = "en";
  }
  const headerContent = await getContent(locale, "header");
  const footerContent = await getContent(locale, "footer");
  const localizedCommon = await getContent(locale, "common");
  const mailingListComponentContent = await getContent(
    locale,
    "mailing-list-component"
  );
  const faqContent = await getContent(locale, "faq");
  return {
    props: {
      faqContent,
      headerContent,
      footerContent,
      mailingListComponentContent,
      localizedCommon,
    },
  };
}

export default FAQ;
