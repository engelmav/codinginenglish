import { styled, css } from "@compiled/react";
import { sm } from "../compiledUtils";

// const smRules = sm(css`
// color: red;
// border: 1px red dotted;
// `);
/* ${sm(css`min-width: 180px`)} */
// @media only screen and (min-width: 200px) {
//   min-width: 180px;
// }
export const HeaderImage = styled.img`
  cursor: pointer;
  min-width: 180px;
`;
