import styled from "styled-components";
import { typography, space, border, fontSize, color } from "styled-system";
import { boxy } from "../Box";
import {
  font,
  fontColor,
  debugBorder,
  darkGray,
  cieOrange,
} from "../sharedStyles";

export const TitleH1 = styled.h1`
  font-family: Roboto Mono;
  ${fontSize}
  ${space}
  ${color}
  ${typography}

  font-weight: 700;
`;

TitleH1.defaultProps = {
  fontSize: ["35px", "40px", "60px", "65px"],
};

export const H2 = styled.h2`
  font-family: Roboto Mono;
  text-transform: uppercase;
  ${space}
  ${fontSize}
  ${fontColor}
  ${typography}
  ${color}
`;
H2.defaultProps = {
  mt: 3,
  mb: 2,
  fontSize: ["20px", "25px", "30px", "40px"],
  textAlign: "center",
};

export const H3 = styled.h3`
  font-family: Roboto Mono;
  ${typography}
  ${fontColor}
  ${debugBorder}
  ${space}

  ${border}
  ${boxy}

  line-height: 1.5em;
`;
H3.defaultProps = {
  mb: 2,
};

export const TitleH2 = styled.h2`
  ${boxy}
  ${space}

  ${typography}

  font-size: max(1.45rem, min(2.0rem, 2.5vw));
`;

export const P = styled.p`
  ${font}
  ${fontColor}
  ${debugBorder}
  ${space}
  ${typography}
  ${border}
  ${boxy}

  line-height: 1.5em;
`;

P.defaultProps = {
  mb: 2,
};

const Ol = styled.ol`
  ${font}
  ${fontColor}
  ${debugBorder}
  ${space}
  ${typography}

  line-height: 1.5em;
  height: auto;

  li {
    margin-left: 50px;
  }
`;
Ol.defaultProps = {
  p: 3,
};
export { Ol };

export const PH = styled.p`
  .half_background {
    color: white;
    background: linear-gradient(to bottom, ${cieOrange} 75%, transparent 25%);
  }
  color: white;

  font-family: Roboto;
  ${font}
  ${debugBorder}
  ${space}
  ${typography}
  ${border}
  ${boxy}
`;
