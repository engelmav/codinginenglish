import React, { useEffect, useState } from "react";
import getContent from "../cms";
import Link from "next/link";
import Date from "./date";
import { H1, UL } from "./typography";
import * as colors from "./colors";
import { styled } from "@linaria/react";
import * as r from "./responsive";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${colors.ciePurpleTemp};
  min-width: 100%;
  padding: 64px;
  ${r.p([32, 64])}
`;

const A = styled.a`
  color: white;
`;

const H1NewContent = styled(H1)`
  color: white;
  margin-bottom: 32px;
  text-align: center;
  font-size: 20px;
  ${r.fontSize(["25px", "30px", "40px", "40px"])}
`;

export const FreshPosts = ({ locale, title }) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function init() {
      const allPostsData = await getContent(
        locale,
        "blog-entries",
        "&_sort=date:DESC"
      );
      setPosts(allPostsData);
    }
    init();
  }, [locale]);
  return (
    <Box>
      <H1NewContent>{title}</H1NewContent>
      <UL>
        {posts.map(({ id, date, title, slug }) => {
          console.log("returning date", date);
          return (
            <li key={id}>
              <Link href={`/blog/posts/${slug}`}>
                <A>{title}</A>
              </Link>
              <br />
              <small>
                <Date dateString={date} />
              </small>
            </li>
          );
        })}
      </UL>
    </Box>
  );
};
export default FreshPosts;
