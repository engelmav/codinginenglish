import styled from "styled-components";
import { font } from "../sharedStyles";
import { typography, space, flexbox, layout, color, background } from "styled-system";

const ContentSection = styled.article`
  display: flex;
  flex-direction: column;
  ${flexbox}
  ${font}
  ${space}
  ${typography}
  ${layout}
  ${background}
  ${color}
  
  
`;
ContentSection.defaultProps = {
  maxWidth: "800px"
};

export { ContentSection };
