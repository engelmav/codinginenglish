import React, { useState } from "react";
import Layout from "../components/Layout";
import getContent from "../cms";
import { AppStoreProvider } from "../stores/appStoreReact";
import ReactMarkdown from "react-markdown";
import { H1, H2, Title, smFont } from "../components/typography";
import { MdArticle } from "../components/markdown";
import { styled } from "@linaria/react";
import Modal from "../components/Modal";
import rehypeRaw from "rehype-raw";
import { cieOrange } from "../components/colors";
import { AutoScaleImage } from "../UtilComponents";
import dynamic from "next/dynamic";
const MailingList = dynamic(() => import("../components/MailingList"));

const H1Faq = styled(H1)`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;
const FaqTitle = styled(H1)`
  padding-top: 40px;
  padding-bottom: 20px;
  text-align: center;
`;

const FAQ = (props) => {
  const { faqContent, mailingListComponentContent } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  const Button = ({ children }) => (
    <span
      style={{
        textDecoration: "underline",
        cursor: "pointer",
        color: cieOrange,
      }}
      onClick={() => setDialogOpen(true)}
    >
      {children}
      <span style={{ fontSize: "16px" }}> ✨</span>
    </span>
  );
  const CurricButton = ({ children }) => (
    <span
      style={{
        textDecoration: "underline",
        cursor: "pointer",
        color: cieOrange,
      }}
      onClick={() => setSubscribeOpen(true)}
    >
      {children}
      <span style={{ fontSize: "16px" }}> ✨</span>
    </span>
  );
  return (
    <AppStoreProvider>
      <Layout {...props}>
        <FaqTitle>{faqContent.title}</FaqTitle>
        <AutoScaleImage src="https://cie-assets.nyc3.cdn.digitaloceanspaces.com/faq/question.png" />
        <MdArticle>
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: H1Faq,
              btn: Button,
              curricbtn: CurricButton,
              // img: AutoScaleImage,
              // cta: makeCta,
            }}
          >
            {faqContent.FaqContent}
          </ReactMarkdown>
        </MdArticle>
      </Layout>
      {dialogOpen && (
        <Modal
          title="Content and Language Integrated Learning"
          modalStyles={{
            width: "100%",
            height: "90%",
            backgroundColor: "white",
          }}
          hasScroll={false}
          contentContainerStyles={{ width: "100%", height: "90%" }}
          onClose={() => setDialogOpen(false)}
        >
          <iframe
            style={{ height: "100%", width: "100%" }}
            id="wiki"
            src="https://en.wikipedia.org/wiki/Content_and_language_integrated_learning"
          ></iframe>
        </Modal>
      )}
      {subscribeOpen && (
        <Modal
          title="Subscribe"
          modalStyles={{}}
          contentContainerStyles={{}}
          onClose={() => setSubscribeOpen(false)}
          hasScroll={false}
        >
          <div style={{ display: "flex", flexDirection: "column", padding: "30px" }}>
            <MailingList content={mailingListComponentContent} />
          </div>
        </Modal>
      )}
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
