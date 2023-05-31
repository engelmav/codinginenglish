import styled from "@emotion/styled";
import { P, UL, H1 } from "../components/typography";
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

const Q = styled(P)`
  font-weight: 800;
  padding-top:  .5em;
  padding-bottom: 1em;
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

      <div>
        <div
          style={{
            paddingBottom: "1em",
            paddingTop:"3em",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <H1>Preguntas Más Frecuentes</H1>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Q> ¿Qué consigo al ser programador?</Q>
          <p>
            Ser programador te da la opción de trabajar remotamente, desde tu
            país o desde los estados unidos, sin las complicaciones de visa de
            trabajo Los programadores ganan bien, debido a la alta demanda para
            individuos de esta profesión La cantidad de trabajo en la
            programación es, prácticamente, sin límite.
          </p>
          <Q>¿Por qué enseñan inglés</Q>
          también? Tienes muchísimas más oportunidades de encontrar un trabajo,
          y uno que pague mejor, si hablas inglés.
          <Q>¿Cuánto cuesta el curso?</Q>
          <p>
            El costo del curso es dependiente de tu país de residencia.
            Ofrecemos planes de pago y otros arreglos de acuerdo con tus
            necesidades.
          </p>
          <Q>¿Es online o presencial? </Q>
          <p>
            Ofrecemos el curso <i>online y en persona</i>. ¡Esto no es un MOOC!
          </p>
          <Q>¿Cuando comienza el curso? </Q>
          <p>
            El curso empieza cada 3.5 meses. La próxima apertura es junio 2023.
            La proxima apertura está en setiembre 2023.
          </p>
          <Q>¿Cómo es el horario?</Q>{" "}
          <p>
            Ofrecemos clases de noche empezando a las 6:30pm y los sábados de
            9am -1pm
          </p>
          <Q>Y qué pasa con la IA?</Q>
          <p>
            La inteligencia artificial es parte de las herramientas de trabajo
            que utilizamos. Este curso también forma base de futuros cursos en
            la IA.
          </p>
        </div>
      </div>
    </>
  );
}
