import { client } from "../../util/util";
import { PortableText } from "@portabletext/react";
import { H1, H2, P, Li, UL } from "../../components/typography";
import { ContentSection } from "../../components/Layout";
import groq from "groq";
import Link from "next/link";
import tw, { styled } from "twin.macro";

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

const Author = styled.p`
  font-size: 0.8em;
  color: gray;
`;
const PPrime = styled.p`
  margin-bottom: 30px;
`;
const components = {
  block: {
    h3: ({ children }) => <H2 tw="pt-5 pb-2">{children}</H2>,
    span: ({ children }) => (
      <PPrime className="sdfasd" tw="mb-5">
        {children}
      </PPrime>
    ),
    bullet: ({ children }) => (
      <Li style={{ listStyleType: "disclosure-closed" }}>{children}</Li>
    ),
    li: ({ children }) => (
      <Li style={{ listStyleType: "disclosure-closed" }}>{children}</Li>
    ),
  },
  list: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => (
      <UL tw="ml-5 py-5" className="mt-xl">
        {children}
      </UL>
    ),
  },
  p: ({ children }) => (
    <PPrime className="sdfasd" tw="mb-5">
      {children}
    </PPrime>
  ),
  bullet: ({ children }) => (
    <Li style={{ listStyleType: "disclosure-closed" }}>{children}</Li>
  ),
};

const Post = ({ post, posts }) => {
  return (
    <ContentSection>
      <article>
        <H1>{post?.title}</H1>
        <Author tw="py-3">por {post?.author}</Author>
        <PortableText value={post?.content} components={components} />
        {/* <p>{JSON.stringify(post, null, 2)}</p> */}
        <H2Style>Otros Posts</H2Style>
        {posts?.length > 0 && posts.map((post) => <PostPreview post={post} />)}
      </article>
    </ContentSection>
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
