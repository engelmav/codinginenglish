import { useState, useEffect } from "react";
import { client } from "../util/util";
import { PortableText } from "@portabletext/react";
import { H1, H2, UL } from "./typography";

export function PrivacyModalContent() {
  const [data, setData] = useState(null);
  useEffect(() => {
    // Fetch data from Sanity using a GROQ query
    const fetchData = async () => {
      try {
        const query = `*[_type == "privacyPolicy"]`; // Replace with your own GROQ query
        const result = await client.fetch(query);
        console.log(result);
        setData(result);
      } catch (error) {
        console.error("Error fetching data from Sanity:", error);
      }
    };

    fetchData();
  }, [data?.content]);
  return (
    <>
      {data && (
        <div style={{ padding: "2em" }}>
          <PortableText
            serializers={{
              
            }}
            value={data[0].content}
            components={{

              block: {
                h1: ({ children }) => {
                  console.log(children);
                  return <H1 style={{ paddingBottom: ".5em" }}>{children}</H1>;
                },
                h2: ({ children }) => {
                  console.log(children);
                  return (
                    <H2 style={{ paddingTop: ".7em", paddingBottom: ".7em" }}>
                      {children}
                    </H2>
                  );
                },
                h3: ({ children }) => {
                  console.log(children);
                  return (
                    <h3 style={{ paddingTop: ".7em", paddingBottom: ".7em" }}>
                      {children}
                    </h3>
                  );
                },
                ul: ({ children }) => {
                  console.log(children);
                  return <UL style={{ color: "red" }}>{children}</UL>;
                },
                p: ({ children }) => {
                  console.log(children);
                  return <p style={{ paddingBottom: "1em" }}>{children}</p>;
                },
              },
              types: {
                paragraph: ({ value }) => {
                  console.log(value);
                  return <p style={{ paddingBottom: "1em" }}>{value}</p>;
                },
              },
              
            }}
          />
        </div>
      )}
    </>
  );
}
