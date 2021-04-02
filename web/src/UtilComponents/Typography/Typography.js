import styled from "styled-components";
import { typography, space } from "styled-system";
import { font, fontColor, debugBorder } from "../sharedStyles";

export const Title = styled.h1`
  font-family: Andale Mono,AndaleMono,monospace;
  ${space}
  ${fontColor}
  ${typography}
  // font-size: 3vw;              // ok on desktop, too small on mobile
  // font-size: 2.5rem;           // too big on mobile.
  // font-size: min(2.5rem, 3vw); // ok on desktop, too small on mobile
  // font-size: max(2.5rem, 3vw); // ok on desktop, too big on mobile
  // font-size: 1.75rem; // ok on mobile, too small on desktop
  font-size: max(1.75rem, min(2.5rem, 3vw));
  width: 100%;
`;

export const TitleH2 = styled.h2`
  font-family: Andale Mono,AndaleMono,monospace;
  ${space}
  ${fontColor}
  ${typography}
  // font-size: 3vw;              // ok on desktop, too small on mobile
  // font-size: 2.5rem;           // too big on mobile.
  // font-size: min(2.5rem, 3vw); // ok on desktop, too small on mobile
  // font-size: max(2.5rem, 3vw); // ok on desktop, too big on mobile
  // font-size: 1.75rem; // ok on mobile, too small on desktop
  font-size: max(1.45rem, min(2.0rem, 2.5vw));
`;

export const P = styled.p`
  // word-break: break-all;
  // white-space: normal;
  hyphens: auto;
  ${font}
  ${fontColor}
  ${debugBorder}
`