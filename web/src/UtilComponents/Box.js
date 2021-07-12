import styled from "styled-components";
import { space, color, layout, flexbox, flexGrow, flexWrap } from "styled-system";
import { debugBorder } from "./sharedStyles";


export const Box = styled.div(
  {
    boxSizing: "border-box",
    minWidth: 0,
  },
  space,
  color,
  layout,
  flexbox,
  flexGrow,
  flexWrap,
  debugBorder
);