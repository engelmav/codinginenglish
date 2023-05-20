import styled from "@emotion/styled";
import { P, UL } from "../components/typography";
import { NewsletterForm } from "../components/newsletter";

const Tagline = styled.div`
  font-family: "Montserrat", sans-serif;
  font-weight: 800; /* Extra bold */
  font-size: 3rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  margin: 0 auto;
  text-align: center;
`;


export default function Index() {
  return (
    <>
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
    
        <NewsletterForm />
      
    </>
  );
}
