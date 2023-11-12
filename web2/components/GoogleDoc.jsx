export function GoogleDoc({ googleDocLink, height, width }) {
  return (
    <iframe
      style={{
        width: width ?? "1000px",
        height: height ?? "800px",
      }}
      src={googleDocLink}
    ></iframe>
  );
}
