import { createClient } from "next-sanity";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

const client = createClient({
  projectId: "zkkparnw",
  dataset: "production",
  apiVersion: "2022-03-25",
  useCdn: false,
});

export default function IndexPage({ sessions }) {
  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: "40%", height: "40%" }}
          src="/cie_horizontal_white.jpg"
          alt="me"
          width="1462"
          height="209"
        />
        <h1 style={{ fontStyle: "oblique" }}>Join the global economy</h1>
        <h2>Learn English while you learn to code</h2>
      </header>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {sessions.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",

                paddingTop: "40px",
                paddingBottom: "40px",
              }}
            >
              <h2>Web Applications - Fundamentals</h2>
              <div>
                Duration: 3 months, 2 sessions per week. Duration of each
                session: 2 hours.
              </div>
            </div>
            {sessions.map((session) => (
              <div className="session">
                <div key={session._id} className="title">
                  <Image
                    style={{ width: "3%", height: "3%", marginRight: "8px" }}
                    src="/encouragement-434343.jpg"
                    alt="me"
                    width="1462"
                    height="209"
                  />
                  {session?.name}
                </div>
                <PortableText value={session.description} />
              </div>
            ))}
          </div>
        )}

        {!sessions.length > 0 && <p>No sessions to show</p>}
      </main>
    </>
  );
}

export async function getStaticProps() {
  const sessions = await client.fetch(
    `*[_type == "classSession"] | order(name asc)`
  );

  return {
    props: {
      sessions,
    },
  };
}
