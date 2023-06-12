import { client } from "../../util/util";
import { PortableText } from "@portabletext/react";
import { H1 } from "../../components/typography";

const Post = ({ post }) => {
  return (
    <article>
      <H1>{post?.title}</H1>
      <PortableText value={post?.content} />
<<<<<<< Updated upstream
=======
      <H2Style>Otros Posts</H2Style>
      {posts?.length > 0 && posts.map((post) => <PostPreview post={post} />)}
>>>>>>> Stashed changes
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
  return {
    props: {
      post,
    },
  };
}

export default Post;
