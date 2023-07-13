import { ContentSection } from "../components/Layout";
import { client } from "../util/util";
import { PortableText } from "@portabletext/react";
import { H1, H2, UL } from "../components/typography";

export default function Privacy({ content }) {
  return (
    <ContentSection>
      <PortableText
        serializers={{}}
        value={content}
        components={{
          block: {
            h1: ({ children }) => {
              return <H1 style={{ paddingBottom: ".5em" }}>{children}</H1>;
            },
            h2: ({ children }) => {
              return (
                <H2 style={{ paddingTop: ".7em", paddingBottom: ".7em" }}>
                  {children}
                </H2>
              );
            },
            h3: ({ children }) => {
              return (
                <h3 style={{ paddingTop: ".7em", paddingBottom: ".7em" }}>
                  {children}
                </h3>
              );
            },
            ul: ({ children }) => {
              return <UL style={{ color: "red" }}>{children}</UL>;
            },
            p: ({ children }) => {
              return <p style={{ paddingBottom: "1em" }}>{children}</p>;
            },
          },
          types: {
            paragraph: ({ value }) => {
              return <p style={{ paddingBottom: "1em" }}>{value}</p>;
            },
          },
        }}
      />
    </ContentSection>
  );
}

export async function getStaticProps() {
  var data = null;
  try {
    const query = `*[_type == "privacyPolicy"]`; // Replace with your own GROQ query
    data = await client.fetch(query);
  } catch (error) {
    console.error("Error fetching data from Sanity:", error);
  }
  return {
    props: {
      content: data[0].content,
    },
  };
}
