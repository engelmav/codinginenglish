import styled from "styled-components";
import { typography, space, border, fontSize } from "styled-system";
import { font, fontColor, debugBorder } from "../sharedStyles";

export const Title = styled.h1`
  font-family: Andale Mono,AndaleMono,monospace;
  ${space}
  ${fontColor}
  ${typography}
  font-size: max(1.75rem, min(2.5rem, 3vw));
  width: 100%;
`;
Title.defaultProps = {

}

export const H2 = styled.h2`
  font-family: Andale Mono,AndaleMono,monospace;
  ${space}
  ${fontSize}
  ${fontColor}
  ${typography}
`;

export const TitleH2 = styled.h2`
  font-family: Andale Mono,AndaleMono,monospace;
  ${space}
  ${fontColor}
  ${typography}
  font-size: max(1.45rem, min(2.0rem, 2.5vw));
`;
TitleH2.defaultProps = {

}

export const P = styled.p`
  hyphens: auto;
  ${font}
  ${fontColor}
  ${debugBorder}
  ${space}
  ${typography}
  ${border}
`;


const Ol = styled.ol`
  li {
    margin-left: 50px;
  }
  ${font}
  ${fontColor}
  ${debugBorder}
  ${space}
  ${typography}
  line-height: 1.5em;
  height: auto;
`;
Ol.defaultProps = {
  p: 3,
};
export { Ol };
