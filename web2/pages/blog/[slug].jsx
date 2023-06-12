import { client } from "../../util/util";
import { PortableText } from "@portabletext/react";
import { H1, H2 } from "../../components/typography";
import groq from "groq";
import styled from "@emotion/styled";
import Link from "next/link";


const PostPreviewStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;

  text-align: center;
`;
const H2Style = styled(H2)`
  text-align: center;
  padding-top: 3em;
`;

const PostPreview = ({ post }) => {
  return (
    <Link href={`/blog/${encodeURIComponent(post.slug.current)}`}>
      <PostPreviewStyle>{post?.title}</PostPreviewStyle>
    </Link>
  );
};

const Post = ({ post, posts }) => {
  return (
    <article>
      <H1>{post?.title}</H1>
      <PortableText value={post?.content} />
      <H2Style>Otros Posts</H2Style>
      {posts.length > 0 && posts.map((post) => <PostPreview post={post} />)}
    </article>
  );
};

export async function getStaticPaths() {
  const paths = await client.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

export async function getStaticProps(context) {
  // It's important to default the slug so that it doesn't return "undefined"
  const { slug = "" } = context.params;
  const post = await client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0]
  `,
    { slug }
  );
  console.log(post);

  const posts = await client.fetch(groq`
        *[_type == "post"]
      `);

  return {
    props: {
      post,
      posts,
    },
  };
}

export default Post;
