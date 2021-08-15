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
  margin: 35px 0 0 0;

  h2 {
    padding-bottom:15px;
  }
  p{
    padding-bottom:10px;
  }
`;


export { ContentSection };
