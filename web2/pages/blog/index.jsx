import Link from "next/link";
import groq from "groq";
import { client } from "../../util/util";
import styled from "@emotion/styled";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgb(2, 0, 36);
  background: linear-gradient(
    309deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(9, 121, 47, 1) 0%,
    rgba(0, 212, 255, 1) 100%
  );
  border-radius: 5px;
  width: 20em;
  height: 20em;
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
`;
const Description = styled.p`
  // @import url("https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i,900,900i");
  // font-family: "Roboto", sans-serif;
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
    _createdAt = "",
  } = post;
  return (
    <Card key={_id}>
      <div>
        <Link href={`/blog/${encodeURIComponent(slug.current)}`}>
          <CardTitle>{title}</CardTitle>
        </Link>{" "}
        <Description>{description}</Description>
      </div>
      <div style={{ display: "flex", alignItems: "space-between" }}>
        <div>
          <Author>{author}</Author>
          <Author>{new Date(_createdAt).toDateString()}</Author>
        </div>
      </div>
    </Card>
  );
}

const Container = styled.div`
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

const Index = ({ posts }) => {
  return (
    <Container>
      {posts.length > 0 && posts.map((post) => <BlogCard post={post} />)}
    </Container>
  );
};

export async function getStaticProps() {
  const posts = await client.fetch(groq`
      *[_type == "post"] | order(_createdAt desc)
    `);
  return {
    props: {
      posts,
    },
  };
}

export default Index;
