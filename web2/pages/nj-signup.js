import styled from "@emotion/styled";
import { ContentSection } from "../components/Layout";
import { H1, H2 as H2Base, P } from "../components/typography";

const H2 = styled(H2Base)`
  margin-top: 1em;
`;

export default function IndexPage() {
  return (
    <>
      <ContentSection>
        <H1>Coding in English (remoto)</H1>
        <H2>25 septiembre - 6:30pm - 8:30pm - $25 por sesión</H2>
      </ContentSection>
      <div
        style={{
          width: "100%",
          height: "1700px",
          overflow: "hidden",
        }}
      >
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSejl2UYktSuZORW31O8JYdkuz1qle_2b_t8wRgVuLJTJhUQaA/viewform?embedded=true"
          frameborder="0"
          style={{ width: "100%", height: "calc(100% - 3px)" }}
        >
          Cargando...
        </iframe>
      </div>
    </>
  );
}
