import React from "react";
import {
  AutoScaleImage,
  Main,
  ContentSection,
  RegisterLink,
} from "../UtilComponents";
import { TitleH1, H2, P } from "../UtilComponents/Typography/Typography";
import BlockQuote from "../UtilComponents/BlockQuote";
import { darkGray, debugBorder } from "../UtilComponents/sharedStyles";
import styled from "styled-components";
import ReactGA from "react-ga";
import ReactMarkdown from 'react-markdown';
import Image from "next/image"


const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const MainLanding = styled(Main)`
  ${debugBorder}
  width: min(90%, 850px);
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;

  p,
  blockquote {
    margin-left: auto;
    margin-right: auto;
    max-width: 700px;
  }

  img {
    width: 25%;
  }

  img.wide-image {
    width: 70%;
    margin-left: auto;
    margin-right: auto;
  }

  p.sub-heading {
    font-size: 25px;
  }

  @media (max-width: 700px) {
    p.sub-heading {
      font-size: 20px;
      padding-bottom: 0px;
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

const RegisterCtaButton = (props) => (
  <RegisterLink
    width={["100%", "250px", "250px", "250px"]}
    mt={2}
    py={3}
    px={4}
    mb={3}
    alignSelf="center"
    href="/apply"
    onClick={() => {
      ReactGA.event({
        category: "registration",
        action: "clickedRegister",
        label: props.where,
      });
    }}
  >
    ¡inscríbete ahora!
  </RegisterLink>
);

const Section = ({
  sectionTitle,
  sectionContent,
  imageUrl,
  callToActionButton,
  settings
}) => {
  return (
    <ContentSection mt={[1, 5, 5, 5]}>
      <Image
        alt="image"
        src={`${settings.edgeAssets}/${imageUrl}`}
        layout="responsive"
      />
      <H2>{sectionTitle}</H2>
      <ReactMarkdown
  components={{"p": P}}>{sectionContent}</ReactMarkdown>
      <RegisterCtaButton where="after crea aplicaciones" />
    </ContentSection>
  );
};

const LandingPage = (props) => {
  const { settings, content } = props;
  console.log(content);
  return (
    <MainLanding p={1}>
      <ContentSection display="flex" flexDirection="column" textAlign="center">
        <TitleH1 my={[3, 5, 5, 5]}>{content.title}</TitleH1>
        <P className="sub-heading">{content.subtitle}</P>
      </ContentSection>
      {content.Section.map(section => <Section {...section} settings={settings} />)}
      {/*the smallest, 1, keeps the next h1 "above the fold" */}
      <ContentSection mt={[1, 5, 5, 5]}>
        <AutoScaleImage
          mt={3}
          mb={3}
          width={{ small: 100 }}
          alignSelf="center"
          loading="lazy"
          alt="Speak English, Build Apps"
          srcSet={`${props.settings.edgeAssets}/home/chat-icon-green-red-small.png 320w, ${props.settings.edgeAssets}/home/chat-icon-green-red.png 1920w`}
          //sizes="(min-width: 600px) 692px, 320px"
          src={`${props.settings.edgeAssets}/home/3-tech-692w.webp`}
        />
        <H2>Crea aplicaciones, habla inglés</H2>
        <P>
          Aumenta tus oportunidades y tus ingresos. En la economía global, las
          dos competencias más cotizadas son la programación y el inglés.
          Consigue las dos aquí en Coding in English.
        </P>
        <P>
          Practica conversación en inglés en cada clase, especialmente sobre
          ingeniería de software, con gerentes de producto, compañeros,
          clientes. Realiza revisiones de código, hacer preguntas en foros, leer
          documentación y mucho más.
        </P>
        <P fontStyle="italic" textAlign="center">
          Salta al <i>mainstream</i> global.
        </P>
        <RegisterCtaButton where="after crea aplicaciones" />
      </ContentSection>
      <ContentSection mt={[3, 5, 5, 5]}>
        <AutoScaleImage
          className="wide-image"
          mt={3}
          mb={3}
          alignSelf="center"
          alt={"Software Stack"}
          srcSet={`${props.settings.assets}/home/3-tech-320w.webp 320w, ${props.settings.assets}/home/3-tech-692w.webp 1920w`}
          src={`${props.settings.assets}/home/3-tech-692w.webp`}
        />
        <H2>Crea tu cartera de proyectos</H2>
        <P textAlign="center">Crea tu cartera de proyectos sobre la marcha.</P>
        <P>
          Todo el trabajo realizado en clase es tuyo y puedes exponerlo en tu
          cartera de proyectos de la aplicación web. Presume ante empleadores
          potenciales de tus conocimientos de ReactJS, Python y MySQL, con
          código profesional en un repositorio de GitHub y una aplicación web
          implementada.
        </P>
      </ContentSection>
      <ContentSection mt={[3, 5, 5, 5]}>
        <AutoScaleImage
          alignSelf="center"
          mt={4}
          mb={3}
          loading="lazy"
          alt="Learn Vocabulary and Grammar in Real Context"
          srcSet={`${props.settings.assets}/home/dictionary-sm.png 320w, ${props.settings.assets}/home/dictionary.png 1920w`}
          //sizes="(min-width: 600px) 692px, 320px"
          src={`${settings.assets}/home/dictionary.png`}
        />
        <H2>Aprende vocabulario y gramática en un contexto real</H2>
        <P>
          Todos nuestros cursos están complementados con prácticas de gramática
          y vocabulario integradas en las clases técnicas.
        </P>
      </ContentSection>

      <ContentSection mt={[3, 5, 5, 5]} mb={3}>
        <AutoScaleImage
          mt={4}
          mb={3}
          alignSelf="center"
          loading="lazy"
          alt="Learn in a Live Teaching Environment"
          srcSet={`${props.settings.assets}/home/meeting-sm.png 320w, ${props.settings.assets}/home/meeting.png 1920w`}
          src={`${settings.assets}/home/meeting.png`}
        />
        <H2>Estudia en un entorno de aprendizaje en vivo</H2>
        <P>
          Como muchas clases han pasado a ser en línea, muchos estudiantes se
          han visto obligados a aprender en soledad. Nosotros traemos la
          calidez, la motivación y la comunidad que les faltan a las clases en
          línea. Puedes realizar actividades en grupo, hacer preguntas a tu
          instructor, reír y compartir tus dudas y tus logros.
        </P>
        <P>
          Los estudiantes trabajan con los instructores como grupo y también de
          forma individual. El aula virtual está equipada con vídeo y chat
          integrados y con ejercicios interactivos de inglés y de programación.
          Los ejercicios de programación se realizan en una máquina virtual de
          Ubuntu completamente equipada y en la misma aula virtual.
        </P>
        <P>
          Recibe ayuda de tu instructor al momento si te quedas estancado o no
          entiendes alguna de las clases. Despídete de los aburridos foros de
          debate (aunque también tendremos de esos). ¡Si te pierdes, dilo! Deja
          que un instructor paciente y experto te ayude. ¡No estás solo en esto!
        </P>
        <RegisterCtaButton where="after estudia en vivo" />
      </ContentSection>

      <BlockQuote cite="https://medium.com/@lnuk2009jp/is-english-language-really-that-important-in-learning-programming-812a78be79b5">
        <P>
          «Como estudiante extranjero, aprender sobre cualquier materia… era muy
          duro. Para aprender, primero necesitaba comprender una herramienta
          básica: el inglés».
        </P>
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
