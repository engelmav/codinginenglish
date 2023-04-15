const fontSize = "1.6rem";
const fontFamily = "sans-serif";
const color = "black";
const spacing = { paddingBottom: "0", lineHeight: "1.4em" };

const baseTypography = Object.assign(
  { fontSize },
  { color },
  { fontFamily },
  spacing
);

const pBaseStyle = baseTypography;
export function P({ children, style }: { children: any; style?: any }) {
  const finalStyle = style ? Object.assign({}, pBaseStyle, style) : pBaseStyle;
  return <p style={finalStyle}>{children}</p>;
}

const listBaseStyle = Object.assign({}, baseTypography, {
  marginLeft: "2.5rem",
  paddingLeft: ".5rem",
});

export function Li({ children, style = {} }: { children: any; style?: any }) {
  const finalStyle = Object.assign({}, listBaseStyle, style);
  return <li style={finalStyle}>{children}</li>;
}
