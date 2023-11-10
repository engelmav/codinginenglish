export function GoogleDoc({ googleDocLink }) {
    return <iframe style={{
        width: "1000px",
        height: "800px"
    }}
        src={googleDocLink}></iframe>
}