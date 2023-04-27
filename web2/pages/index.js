// pages/index.js
import styled from "@emotion/styled";
import { P, UL } from "../components/typography";
import { NewsletterForm } from "../components/newsletter";
import { Layout } from "../components/Layout";

const Tagline = styled.div`
  font-family: "Montserrat", sans-serif;
  font-weight: 800; /* Extra bold */
  font-size: 3rem;
  color: #ffc107;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 1rem;
  margin-top: 1rem;
  margin: 0 auto;
  text-align: center;
`;

const FormDropShadow = styled.div`
  // css to show a dropshadow when the background is black
  // box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1), 0 1px 3px rgba(255, 255, 255, 0.08);
box-sizing: border-box;

`;

export default function Index() {
  return (
    <Layout>
      <div style={{ marginBottom: "2em" }}>
        <Tagline>
          aprende a programar.
          <br />
          —
          <br />
          mejora tu inglés.
          <br />
          —
          <br />
          consigue trabajo.
        </Tagline>
      </div>
      <P>
        No sólo aprendas inglés. <i>Haz</i> algo con tu inglés - y gana dinero
        como programador de software.{" "}
      </P>
      <P>
        Nuestro curso único te enseña ambas cosas a la vez, y provee consejo,
        ayuda y orientación profesional para conseguir un trabajo moderno -{" "}
        <i>sin fronteras.</i>
      </P>

      <div style={{ marginBottom: "2em", marginTop: "1em" }}>
        <UL>
          {[
            "Clases de noche",
            "Pago flexible",
            "Ayuda para conseguir trabajo remoto",
            "No necesitas tu propia computadora",
          ].map((li) => (
            <li>{li}</li>
          ))}
        </UL>
      </div>
      <FormDropShadow>
        <NewsletterForm />
      </FormDropShadow>
    </Layout>
  );
}
