import React, { useState, lazy, Suspense } from "react";
import { Main, ContentSection, Button } from "../UtilComponents";
import { Title, P } from "../UtilComponents/Typography/Typography";
import { whenSmallScreen, fontMonospace } from "../UtilComponents/sharedStyles";
import BlockQuote from "../UtilComponents/BlockQuote";
import { Box } from "../UtilComponents/Box";
import {
  orangeBgColor,
  darkGray,
  debugBorder,
  cieOrange,
} from "../UtilComponents/sharedStyles";
import styled from "styled-components";
import { Link } from "react-router-dom";

const SectionImage = styled.img`
  width: 225px;
  padding-bottom: 20px;
  ${whenSmallScreen`
    width: 70px;
    height: auto;`}
`;

const LPButton = styled(Button)`
  padding: 10px;
  color: white;
  ${fontMonospace}
`;

const MainLanding = styled(Main)`
  width: min(90%, 700px);
  & .cie-title {
    font-family: monospace;
    font-size: max(1rem, min(2.5rem, 3vw));
  }
  display: flex;
  flex-direction: column;
  ${debugBorder}
  & .section {
    flex-basis: 100%;
  }
`;

const ContentSectionLanding = styled(ContentSection)`
  line-height: 1.5em;
`;

const I = styled.p`
  font-style: italic;
`;

const RegisterLink = styled(Link)`
  ${orangeBgColor}
  text-decoration: none;
  display: inline-block;
  text-align: center;
  padding: 10px;
  color: white;
  border-radius: 2px;
  ${fontMonospace}
  a {
    color: ${cieOrange};
  }
  &:hover:enabled {
    color: rgba(255, 255, 255, 1);
    box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
  }
  align-self: center;
`;

const TaglineTitle = styled.h1`
  font-family: Andale Mono, AndaleMono, monospace;
  color: ${darkGray};
  /* font-size: max(1rem, min(2.5rem, 2.5vw)); */
  ${whenSmallScreen`
    font-size: 1.25rem;`}
  font-weight: bolder;
  text-align: center;
  padding: 0;
  margin: 0;
`;

const SectionTitle = styled(Title)`
  text-align: center;
  color: ${darkGray};
  ${debugBorder}
`;

const TechStackImg = styled.img`
  width: 100%;
  height: auto;
  padding-bottom: 20px;
`;

const Home = (props) => {
  const { settings } = props;
  console.log("Mounting Home")
  return (
    <MainLanding p={1}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={20}>
        <Box mt={3}>
          <TaglineTitle>Únete a la economía global</TaglineTitle>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center">
          <ContentSection>
            <p style={{ textAlign: "center" }}>
              Tu clase de inglés se ha convertido en un grupo de ingenieros de
              software.
            </p>
          </ContentSection>
        </Box>
      </Box>
      <Box mt={0} alignSelf="center">
        <SectionImage
          loading="lazy"
          alt="Speak English, Build Apps"
          src={`${settings.assets}/home/chat-icon-green-red.png`}
        />
      </Box>
      <SectionTitle mb={2}>Habla inglés, crea aplicaciones</SectionTitle>
      <ContentSectionLanding>
        <p>
          Prácticas de conversación en cada clase, especialmente sobre
          ingeniería de software.
        </p>
        <p>
          Los temas comprenden trabajar con gerentes de producto, compañeros,
          clientes, realizar revisiones de código, hacer preguntas en foros,
          leer documentación y mucho más.
        </p>
        <I>Y crear software real en el proceso.</I>
      </ContentSectionLanding>
      <Box mt={40} alignSelf="center">
        <TechStackImg
          alt={"Software Stack"}
          src={`${props.settings.assets}/home/3-tech.png`}
        />
      </Box>
      <SectionTitle>Crea tu cartera de proyectos</SectionTitle>
      <ContentSectionLanding>
        <p>Crea tu cartera de proyectos sobre la marcha.</p>
        <p>
          Todo el trabajo realizado en clase es tuyo y puedes exponerlo en tu
          cartera de proyectos de la aplicación web. Presume ante empleadores
          potenciales de tus conocimientos de ReactJS, Python y MySQL, con
          código profesional en un repositorio de GitHub y una aplicación web
          implementada.
        </p>
        <RegisterLink to="/apply">Solicita una plaza aquí</RegisterLink>
      </ContentSectionLanding>
      <Box mt={40} alignSelf="center">
        <SectionImage
          loading="lazy"
          alt="Learn Vocabulary and Grammar in Real Context"
          src={`${settings.assets}/home/dictionary.png`}
        />
      </Box>
      <SectionTitle mb={2}>
        Aprende vocabulario y gramática en un contexto real
      </SectionTitle>
      <ContentSectionLanding>
        <p>
          Todos nuestros cursos están complementados con prácticas de gramática
          y vocabulario integradas en las clases técnicas.
        </p>
      </ContentSectionLanding>
      <Box mt={40} alignSelf="center">
        <SectionImage
          loading="lazy"
          alt="Learn in a Live Teaching Environment"
          src={`${settings.assets}/home/meeting.png`}
        />
      </Box>
      <SectionTitle mt={4} mb={2}>
        Estudia en un entorno de aprendizaje en vivo
      </SectionTitle>
      <ContentSectionLanding>
        <p>
          Como muchas clases han pasado a ser en línea, muchos estudiantes se
          han visto obligados a aprender en soledad. Nosotros traemos la
          calidez, la motivación y la comunidad que les faltan a las clases en
          línea. Puedes realizar actividades en grupo, hacer preguntas a tu
          instructor, reír y compartir tus dudas y tus logros.
        </p>
        <p>
          Los estudiantes trabajan con los instructores como grupo y también de
          forma individual. El aula virtual está equipada con vídeo y chat
          integrados y con ejercicios interactivos de inglés y de programación.
          Los ejercicios de programación se realizan en una máquina virtual de
          Ubuntu completamente equipada y en la misma aula virtual.
        </p>
        <p>
          Recibe ayuda de tu instructor al momento si te quedas estancado o no
          entiendes alguna de las clases. Despídete de los aburridos foros de
          debate (aunque también tendremos de esos). ¡Si te pierdes, dilo! Deja
          que un instructor paciente y experto te ayude. ¡No estás solo en esto!
        </p>
      </ContentSectionLanding>
      <BlockQuote cite="https://medium.com/@lnuk2009jp/is-english-language-really-that-important-in-learning-programming-812a78be79b5">
        <p>
          «Como estudiante extranjero, aprender sobre cualquier materia… era muy
          duro. Para aprender, primero necesitaba comprender una herramienta
          básica: el inglés».
        </p>
        <footer>
          —Takeishi Kimoto,{" "}
          <cite>
            <a href="https://medium.com/@lnuk2009jp/is-english-language-really-that-important-in-learning-programming-812a78be79b5">
              ¿De verdad es tan importante saber inglés para aprender
              programación?
            </a>
          </cite>
        </footer>
      </BlockQuote>
    </MainLanding>
  );
};

export { Home };
