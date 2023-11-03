import styled from "styled-components";
import {
  background,
  border,
  compose,
  space,
  color,
  layout,
  flexbox,
  flexGrow,
  flexWrap,
  position
} from "styled-system";
import { debugBorder } from "./sharedStyles";

export const Box = styled.div(
  {
    boxSizing: "border-box",
    minWidth: 0,
  },
  background,
  border,
  space,
  color,
  layout,
  flexbox,
  flexGrow,
  flexWrap,
  debugBorder,
  position,
  layout
);

export const boxy = compose(space, position, color, layout, flexbox, flexGrow, flexWrap);
