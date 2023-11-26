import { serialize } from "next-mdx-remote/serialize";
import fs from "fs";
// import { MDXProvider } from "@mdx-js/react";
import { MDXRemote } from "next-mdx-remote";
import { AccordionPanel } from "../../components/Accordion/Accordion";
import { CodePenEmbed } from "../../components/CodePenEmbed";
import { GoogleDoc } from "../../components/GoogleDoc";
// import { AccordionPanel } from "./components/Accordion/Accordion";
import { FillInBlanks } from "../../components/FillInBlanks/FillInBlanks";
import { CustomComponents } from "../../components/mdxComponents";
import { FloatingModal } from "../../components/FloatingModal/FloatingModal";
import { Table } from "../../components/Table";

const components = {
  AccordionPanel,
  CodePenEmbed,
  GoogleDoc,
  FillInBlanks,
  Table,
  ...CustomComponents,
};

export default function PostPage({ source }) {
  return (
    <div>
      {/* <Head><title>{source.frontmatter.title}</title></Head> */}
      <FloatingModal />
      <MDXRemote components={components} {...source} />
    </div>
  );
}
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps(ctx) {
  const { slug } = ctx.params;

  // retrieve the MDX blog post file associated
  // with the specified slug parameter
  console.log("Current directory:", process.cwd());
  const postFile = fs.readFileSync(`pages/_sessions/${slug}.mdx`);

  // read the MDX serialized content along with the frontmatter
  // from the .mdx blog post file
  const mdxSource = await serialize(postFile);
  return {
    props: {
      source: mdxSource,
    },
    // enable ISR
    revalidate: 60,
  };
}
