import { P, UL, H1 } from "../components/typography";
import { ContentSection } from "../components/Layout";
import { NewsletterForm } from "../components/newsletter";
import tw, { styled } from "twin.macro";
import Image from "next/image";

const Tagline = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Montserrat", sans-serif;
  font-weight: 800; /* Extra bold */
  font-size: 5em;
  text-align: center;
  position: relative;
  margin: 0;
  color: white;
  @media (max-width: 768px) {
    font-size: 1.5em;
  }
`;
const HeroWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 50vw;
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 50%;
`;
const ImageWrapper = styled.div`
  z-index: -1;
`;

const Q = tw.p`
  font-semibold pt-5 md:pt-6 lg:pt-9 pb-1 
`;
const TextBg = tw.div`
  bg-black bg-opacity-40
  h-full flex flex-col 
  items-center justify-center
  w-full
`;

const Subtitle = styled.div`
  color: white;
  font-family: "Montserrat", sans-serif;
  font-size: 2em;
  @media (max-width: 768px) {
    font-size: 1.1em;
  }
`;


export default function Index() {
  return (
    <>
      <HeroWrapper>
        <ImageWrapper>
          <Image
            priority
            src="/coworking-space-hero-1024.png"
            alt="Hero image"
            objectFit="cover"
            fill={true}
          />
        </ImageWrapper>
        <TextBg>
          <Tagline>Conviértete en programador fullstack bilingüe</Tagline>
          <Subtitle>y consigue un trabajo.</Subtitle>
        </TextBg>
      </HeroWrapper>

      <ContentSection>
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
            ].map((li, idx) => (
              <li key={idx}>{li}</li>
            ))}
          </UL>
        </div>
      </ContentSection>
      <NewsletterForm />

      <ContentSection>
        <H1 tw="text-center pt-9 pb-3">Preguntas Más Frecuentes</H1>
        <Q> ¿Qué consigo al ser programador?</Q>
        <p>
          Ser programador te da la opción de trabajar remotamente, desde tu país
          o desde los estados unidos, sin las complicaciones de visa de trabajo
          Los programadores ganan bien, debido a la alta demanda para individuos
          de esta profesión La cantidad de trabajo en la programación es,
          prácticamente, sin límite.
        </p>
        <Q>¿Por qué enseñan inglés?</Q>
        también? Tienes muchísimas más oportunidades de encontrar un trabajo, y
        uno que pague mejor, si hablas inglés.
        <Q>¿Cuánto cuesta el curso?</Q>
        <p>
          El costo del curso es dependiente de tu país de residencia y otros
          factores. Ofrecemos planes de pago y otros arreglos de acuerdo con tus
          necesidades.
        </p>
        <Q>¿Es online o presencial? </Q>
        <p>
          Ofrecemos el curso <i>online y en persona</i>. ¡Esto no es un MOOC!
        </p>
        <Q>¿Cuando comienza el curso? </Q>
        <p>
          El curso empieza cada 3.5 meses. Las próximas aperturas es septiembre
          2023 y enero 2024.
        </p>
        <Q>¿Cómo es el horario?</Q>{" "}
        <p>
          Ofrecemos clases de noche empezando a las 6:30pm y los sábados de 9am
          -1 pm EST
        </p>
        <Q>¿Y qué pasa con la IA?</Q>
        <p>
          La inteligencia artificial es parte de las herramientas de trabajo que
          utilizamos. Este curso también forma base de futuros cursos en la IA.
        </p>
      </ContentSection>
    </>
  );
}
