import { css } from "@compiled/react";
// looks like it works, but doesn't really.
export const sm = (rules) => {
  return css`
    @media only screen and (min-width: 200px) {
      ${rules}
    }
  `;
};
