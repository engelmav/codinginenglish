import { styles } from "styled-system";

const breakpoints = ["40em", "52em", "64em", "80em"];

const steps = {
  1: "10px",
  2: "90px",
  3: "15px",
};

export function bg(values) {
  const styles = {};
  breakpoints.forEach((breakpoint, idx) => {
    styles[`@media (min-width: ${breakpoint})`] = {
      backgroundColor: values[idx],
    };
  });
  return styles;
}

export function p(values) {
  const styles = {};
  breakpoints.forEach((breakpoint, idx) => {
    styles[`@media (min-width: ${breakpoint})`] = {
      padding: steps[values[idx]],
    };
  });
  return styles;
}

export function px(values) {
  const styles = {};
  breakpoints.forEach((breakpoint, idx) => {
    styles[`@media (min-width: ${breakpoint})`] = {
      paddingLeft: steps[values[idx]],
      paddingRight: steps[values[idx]],
    };
  });
  return styles;
}
export function py(values) {
  const styles = {};
  breakpoints.forEach((breakpoint, idx) => {
    styles[`@media (min-width: ${breakpoint})`] = {
      paddingTop: steps[values[idx]],
      paddingBottom: steps[values[idx]],
    };
  });
  return styles;
}

export function pt(values) {
  const styles = {};
  breakpoints.forEach((breakpoint, idx) => {
    styles[`@media (min-width: ${breakpoint})`] = {
      paddingTop: steps[values[idx]],
    };
  });
  return styles;
}


export function pb(values) {
  const styles = {};
  breakpoints.forEach((breakpoint, idx) => {
    styles[`@media (min-width: ${breakpoint})`] = {
      paddingBottom: steps[values[idx]],
    };
  });
  return styles;
}
