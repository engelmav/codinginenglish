// const breakpoints = ["40em", "52em", "64em", "80em"];
const breakpoints = [
  ["min-width", "40em"],
  ["min-width", "52em"],
  ["min-width", "64em"],
  ["min-width", "80em"]
]


const fontSteps = {
  1: "10px",
  2: "90px",
  3: "15px",
  4: "25px",
  6: "30px",
  7: "40px",
  "20px": "20px",
  "25px": "25px",
  "30px": "30px",
  "40px": "40px"
};

export function bg(values) {
  const styles = {};
  breakpoints.forEach((breakpoint, idx) => {
    styles[`@media (${breakpoint[0]}: ${breakpoint[1]})`] = {
      backgroundColor: values[idx],
    };
  });
  return styles;
}

export function fontSize(values){
  const styles = {};
  breakpoints.forEach((breakpoint, idx) => {
    // let val;
    // if (values[idx]?.endsWith("px")){
    //   val = values[idx];
    // } else {
    //   val = fontSteps[values[idx]]
    // }
    styles[`@media (${breakpoint[0]}: ${breakpoint[1]})`] = {
      fontSize: fontSteps[values[idx]],
    };
  });
  return styles;
}

export function minWidth(values){
  const styles = {};
  breakpoints.forEach((breakpoint, idx) => {
    styles[`@media (${breakpoint[0]}: ${breakpoint[1]})`] = {
      minWidth: values[idx],
    };
  });
  return styles;
}

export function p(values) {
  const styles = {};
  breakpoints.forEach((breakpoint, idx) => {
    styles[`@media (${breakpoint[0]}: ${breakpoint[1]})`] = {
      padding: values[idx],
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