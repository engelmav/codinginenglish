import Link from "next/link";
import groq from "groq";
import { client } from "../../util/util";
import styled from "@emotion/styled";
import { H1 } from "../../components/typography";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgb(2, 0, 36);

  border-radius: 5px;
  width: 20em;
  height: 30em;
  @media (max-width: 768px) {
    height: auto;
    width: 90%;
  }
  padding: 1.5em;
`;

const CardTitle = styled.h1`
  @import url("https://fonts.googleapis.com/css2?family=Noto+Serif:wght@500&display=swap");
  font-family: "Noto Serif", serif;
  font-size: 2.5em;
  color: white;
  @media (max-width: 768px) {
    font-size: 1.5em;
  }
  line-height: 1em;
  padding-bottom: 0.7em;
`;
const Description = styled.p`
  // @import url("https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i,900,900i");
  font-family: "Open Sans", sans-serif;
  font-size: 1em;
  color: white;
`;
const Author = styled.p`
  font-size: 0.75em;
  color: white;
`;

function BlogCard({ post }) {
  const {
    _id,
    title = "",
    author = "",
    description = "",
    slug = "",
    startDate = "",
  } = post;
  return (
    <Card key={_id}>
      <div>
        <CardTitle>{title}</CardTitle>

        <Description>{description}</Description>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "2em",
        }}
      >
        <div style={{ width: "40%" }}>
          <Author>Start Date</Author>
          <Author>
            {startDate ? new Date(startDate).toLocaleDateString() : "TBD"}
          </Author>
        </div>
        <Button>Solicita plaza</Button>
      </div>
    </Card>
  );
}

const Button = styled.button`
  background: white;
  font-family: "Open Sans", sans-serif;
  font-size: 0.8em;
  padding: 1em;
  padding-left: 1.5em;
  padding-right: 1.5em;
  border-radius: 3px;
  width: 60%;
`;
const TileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2em;
  margin: 0 auto;
  margin-top: 2em;
  margin-bottom: 2em;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1em;
    margin-top: 1em;
    margin-bottom: 1em;
  }
`;
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 1000px;
  padding: 0 1em;
  padding-top: 2em;
  @media (max-width: 768px) {
    padding: 0 1em;
  }
`;

export default function Index({ courses }) {
  return (
    <PageContainer>
      <H1>Courses</H1>
      <TileContainer>
        {courses.length > 0 &&
          courses.map((course) => <BlogCard post={course} />)}
        <BlogCard
          post={{
            _id: 1,
            author: "Vincent Caudo-Engelmann",
            description:
              "For intermediate English and zero programming proficiency. Nuestra oferta principal. La forma única e innovadora de aprender ambos programación e inglés al mismo tiempo. Para personas que quieren una ruta eficiente y lucrativa. 💼📊 Job offers available.",
            title: "Coding in English",
            startDate: "2023-09-25",
          }}
        />
        <BlogCard
          post={{
            _id: 1,
            author: "Vincent Caudo-Engelmann",
            description:
              "Para programadores de carrera que quieren aumentar sus ingresos y oportunidades alcanzando otros mercados y empresas. Temas incluyen todas las ceremonías Agile, colaboración, arquitectura, etc. 💼📊 Job offers available.",
            title: "English for Programmers",
            startDate: null,
          }}
        />
        <BlogCard
          post={{
            _id: 1,
            author: "Vincent Caudo-Engelmann",
            description:
              "Para programadores de carrera que quieren aumentar sus ingresos y oportunidades alcanzando otros mercados y empresas.",
            title: "Beginner’s English",
            startDate: null,
          }}
        />
      </TileContainer>
    </PageContainer>
  );
}

export async function getStaticProps() {
  const courses = await client.fetch(groq`
        *[_type == "course"] | order(_createdAt desc)
      `);
  return {
    props: {
      courses,
    },
  };
}
