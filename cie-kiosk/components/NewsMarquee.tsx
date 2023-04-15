import Marquee from "react-fast-marquee";
import { P as BaseP } from "./Typography";
function P({ children, style }: { children: any; style?: any }) {
  const finalStyle = Object.assign({}, { fontSize: "1em" }, style);
  return <BaseP style={finalStyle}>{children}</BaseP>;
}
function MarqueeDivider() {
  return (
    <div
      style={{
        display: "flex",
        fontSize: "3em",
        alignItems: "center",
        marginLeft: "10px",
        marginRight: "10px",
        color: "#EB7847",
      }}
    >
      
    </div>
  );
}
function JobItem({ children }: { children: any }) {
  return (
    <div
      style={{
        padding: "5px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <P
          style={{ fontSize: ".8em", color: "#383838" }}
        >{`Experiencia: ${children.experience}`}</P>
        <P
          style={{ fontSize: ".8em", color: "#383838" }}
        >{`Ubicación: ${children.location}`}</P>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "3px",
          marginBottom: "3px",
        }}
      >
        <P style={{ fontWeight: "900" }}>{children.title}</P>
        <div>|</div>
        <P>{`Salario: ${children.salary}`}</P>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <P
          style={{ fontSize: ".8em", color: "#383838" }}
        >{`Tech: ${children.tech}`}</P>
      </div>
    </div>
  );
}

const jobs = [
  {
    title: "Full Stack Dev",
    experience: "1 year",
    location: "Ecuador",
    salary: "$50,000",
    tech: "ReactJS, Python",
  },
  {
    title: "Full Stack Dev",
    experience: "4 years",
    location: "Peru",
    salary: "$60,000",
    tech: "ReactJS, Python",
  },
  {
    title: "Full Stack Dev",
    experience: "6 years",
    location: "Brazil",
    salary: "$73,000",
    tech: "ReactJS, Python, Django",
  },
  {
    title: "Full Stack Dev",
    experience: "1 years",
    location: "Peru",
    salary: "$49,000",
    tech: "ReactJS, Python",
  },
];
const marqueeText = {
  display: "flex",
  flexShrink: "1",
  alignItems: "center",
  padding: "20px",
  fontStyle: "italics",
};

export function NewsMarquee() {
  let fullNews = [
    <BaseP key={1} style={marqueeText}>aprende programación</BaseP>,
    <MarqueeDivider key={2} />,
    <BaseP key={3} style={marqueeText}>mejora tu inglés</BaseP>,
    <MarqueeDivider key={4} />,
    <BaseP key={5} style={marqueeText}>accede el trabajo sin fronteras</BaseP>,
    <MarqueeDivider key={6} />,
  ];
  const newsComponents = jobs.map((jobItem, idx) => (
    <>
      <JobItem key={idx}>{jobItem}</JobItem>
      <MarqueeDivider />
    </>
  ));
  const thing = fullNews.concat(newsComponents);
  return (
    <Marquee speed={70}>
      {" "}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexShrink: "1",
        }}
      >
        {thing}
      </div>
    </Marquee>
  );
}
