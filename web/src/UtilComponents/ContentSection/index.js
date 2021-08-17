import styled from 'styled-components';
import { font } from '../sharedStyles';
import { typography, space, flex } from "styled-system";


const ContentSection = styled.article`
  display: flex;
  flex-direction: column;
  ${font}
  ${space}
  ${typography}
  font-family: Andale Mono, AndaleMono, monospace;
`;


export { ContentSection };
