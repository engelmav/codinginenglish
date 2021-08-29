import styled from "styled-components";
import { font } from "../sharedStyles";
import { typography, space, flexbox, layout } from "styled-system";

const ContentSection = styled.article`
  display: flex;
  flex-direction: column;
  ${flexbox}
  ${font}
  ${space}
  ${typography}
  ${layout}
`;
ContentSection.defaultProps = {
  px: [3, 2, 3, 0, 0],
};

export { ContentSection };
