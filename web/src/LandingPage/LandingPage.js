import React from "react";
import {
  AutoScaleImage,
  Main,
  ContentSection,
  RegisterLink,
} from "../UtilComponents";
import { Title, TitleH1, H2, P } from "../UtilComponents/Typography/Typography";
import { whenSmallScreen } from "../UtilComponents/sharedStyles";
import BlockQuote from "../UtilComponents/BlockQuote";
import { Box } from "../UtilComponents/Box";
import { darkGray, debugBorder } from "../UtilComponents/sharedStyles";
import styled from "styled-components";

const MainLanding = styled(Main)`
  ${debugBorder}

  width: min(90%, 850px);
  margin-bottom:30px;
  display: flex;
  flex-direction: column;

  p, blockquote {
    margin-left: auto;
    margin-right: auto;
    max-width: 700px;
  }

  img {
    width: 25%;
  }

  img.wide {
    width: 70%;
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 700px) {
    h1{
      font-size:35px;
    }
    h2 {
      font-size:30px;
    }
    img {
      width: 35%;
    }
  }

  & .cie-title {
    font-family: monospace;
    font-size: max(1rem, min(2.5rem, 3vw));
  }
  & .section {
    flex-basis: 100%;
  }
`;

const ContentSectionLanding = styled(ContentSection)`
  line-height: 1.5em;
  margin-bottom: 30px;
  p {
    padding-bottom:10px;
  }
`;

const I = styled.p`
  font-style: italic;
`;

const TaglineTitle = styled.h1`
  ${whenSmallScreen`
    font-size: 1.25rem;`}
  font-family: Andale Mono, AndaleMono, monospace;
  color: ${darkGray};
  font-weight: bolder;
  text-align: center;
  padding: 0;
  margin: 0;
`;

const SectionTitle = styled(Title)`
  ${debugBorder}
  text-align: center;
  color: ${darkGray};
`;

const LandingPage = (props) => {
  const { settings } = props;
  return (
    <MainLanding p={1}>
      <ContentSection display="flex" flexDirection="column" textAlign='center' mb={50} mt={30}>
        <TitleH1>
          Únete a la economía global
        </TitleH1>
        <p>
          Tu clase de inglés se ha convertido en un grupo de ingenieros de software.
        </p>
      </ContentSection>

      <AutoScaleImage
        mt={3}
        mb={3}
        alignSelf="center"
        loading="lazy"
        alt="Speak English, Build Apps"
        srcSet={`${props.settings.edgeAssets}/home/chat-icon-green-red-small.png 320w, ${props.settings.edgeAssets}/home/chat-icon-green-red.png 1920w`}
        //sizes="(min-width: 600px) 692px, 320px"
        src={`${props.settings.edgeAssets}/home/3-tech-692w.webp`}
      />
      <H2>
        Habla inglés, crea aplicaciones
      </H2>
      <ContentSectionLanding>
        <p>
          Prácticas de conversación en cada clase, especialmente sobre
          ingeniería de software. Los temas comprenden trabajar con gerentes de producto, compañeros,
          clientes, realizar revisiones de código, hacer preguntas en foros,
          leer documentación y mucho más.
        </p>
        <p style={{ fontStyle: "italic" }}>
          Y crear software real en el proceso.
        </p>
      </ContentSectionLanding>
      <AutoScaleImage
        class="wide"
        mt={5}
        mb={3}
        alignSelf="center"
        alt={"Software Stack"}
        srcSet={`${props.settings.assets}/home/3-tech-320w.webp 320w, ${props.settings.assets}/home/3-tech-692w.webp 1920w`}
        src={`${props.settings.assets}/home/3-tech-692w.webp`}
        // sizes="(min-width: 600px) 692px, 320px"
      />
      <H2>
        Crea tu cartera de proyectos
      </H2>
      <ContentSectionLanding>
        <p>
          Crea tu cartera de proyectos sobre la marcha.
        </p>
        <p>
          Todo el trabajo realizado en clase es tuyo y puedes exponerlo en tu
          cartera de proyectos de la aplicación web. Presume ante empleadores
          potenciales de tus conocimientos de ReactJS, Python y MySQL, con
          código profesional en un repositorio de GitHub y una aplicación web
          implementada.
        </p>
        <RegisterLink mt={3} py={2} px={4} alignSelf="center" href="/apply">
          Solicita una plaza aquí
        </RegisterLink>
      </ContentSectionLanding>

      <AutoScaleImage
        alignSelf="center"
        mt={5}
        mb={3}
        loading="lazy"
        alt="Learn Vocabulary and Grammar in Real Context"
        srcSet={`${props.settings.assets}/home/dictionary-sm.png 320w, ${props.settings.assets}/home/dictionary.png 1920w`}
        //sizes="(min-width: 600px) 692px, 320px"
        src={`${settings.assets}/home/dictionary.png`}
      />
      <H2>
        Aprende vocabulario y gramática en un contexto real
      </H2>
      <ContentSectionLanding>
        <p>
          Todos nuestros cursos están complementados con prácticas de gramática
          y vocabulario integradas en las clases técnicas.
        </p>
      </ContentSectionLanding>

      <AutoScaleImage
        mt={4}
        mb={3}
        alignSelf="center"
        loading="lazy"
        alt="Learn in a Live Teaching Environment"
        srcSet={`${props.settings.assets}/home/meeting-sm.png 320w, ${props.settings.assets}/home/meeting.png 1920w`}
        src={`${settings.assets}/home/meeting.png`}
        //sizes="(min-width: 600px) 692px, 320px"
      />

      <H2>
        Estudia en un entorno de aprendizaje en vivo
      </H2>
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

export default LandingPage;
