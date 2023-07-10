// import styled from "@emotion/styled";
import tw, { styled } from "twin.macro";

const textColor = "black";

export const P = styled.p`
  color: ${textColor};
  padding-bottom: 1em;
`;

export const UL = styled.ul`
  color: ${textColor};
  list-style: none;
  li::before {
    content: "➡ ";
    color: #ff4136;
  }
`;

export const Title = styled.title`
  color: ${textColor};
`;

export const H1 = tw.h1`

  text-4xl text-gray-900 sm:text-4xl lg:text-5xl 

`;
export const H2 = styled.h2`
  color: ${textColor};
  font-size: 18px;
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;
export const H3 = styled.h3`
  color: ${textColor};
  font-size: 16px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const Li = styled.li`
::before {
  content: "➡ ";
  color: #FF4136;
`;
