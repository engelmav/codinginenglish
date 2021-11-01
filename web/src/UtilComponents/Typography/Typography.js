import styled from "styled-components";
import {
  compose,
  typography,
  space,
  shadow,
  border,
  fontSize,
  color,
  fontFamily,
  position
} from "styled-system";
import { boxy } from "../Box";
import {
  font,
  fontColor,
  debugBorder,
  cieOrange,
} from "../sharedStyles";

export const textStyles = compose(fontSize, space, color, shadow, typography);

export const TitleH1 = styled.h1`
  font-family: Roboto Mono;
  font-weight: 700;
  ${textStyles}
  ${position}
`;

TitleH1.defaultProps = {
  fontSize: ["35px", "40px", "60px", "65px"],
};

export const H2 = styled.h2`
  font-family: Roboto Mono;
  text-transform: uppercase;
  ${textStyles}
`;
H2.defaultProps = {
  mt: 3,
  mb: 2,
  fontSize: ["20px", "25px", "30px", "40px"],
  textAlign: "center",
  color: fontColor,
};

export const H3 = styled.h3`
  font-family: Roboto Mono;
  ${textStyles}
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
  font-size: max(1.45rem, min(2rem, 2.5vw));
  ${boxy}
  ${textStyles}
`;

export const P = styled.p`
  ${fontFamily}
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
  ${textStyles}

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

export const Ul = styled.ul`
  ${textStyles}
  margin-left: 1em;

  li {
    list-style-type:"➤";
    padding: 0.2em 0 0 0.6em;
    position: relative;
    margin-left: 20px;
  }
  li::marker {
    font-size: 1.0em; /* or whatever */
    color: ${props => props.markerColor ?  props.markerColor: cieOrange};
  }
`;

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
