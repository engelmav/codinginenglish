import React from "react";
import { Title, TitleH2, P } from "./UtilComponents/Typography/Typography";
import { Main } from "./UtilComponents/Main";
import BlockQuote from "./UtilComponents/BlockQuote";

const AboutUs = () => {
  return (
    <Main>
      <Title>About Us</Title>
      <P>
        Coding in English is born of one passionate and principal belief: that
        all people have the right to -- and the possibility of -- achieving a
        better life, and a better livelihood. To this end, the instructors of
        Coding in English teach both English and programming, dedicated to
        espousing the ideals of kindness, encouragement, and the thrill of
        pedagogy.
      </P>
      <TitleH2>Instructors</TitleH2>
      <P>
        The first instructor at Coding in English,{" "}
        <a href="https://www.linkedin.com/in/vincent-engelmann-76588441/">
          Vincent Engelmann
        </a>
        , began teaching English as a Second Language (ESL) in New Jersey. After
        some years, he transitioned into software development. But the pull to
        teach never left him, and he decided in March of 2021 to begin Coding in
        English -- to teach immersive English to non-native speakers, in effect
        teaching both English and programming.
      </P>
      <TitleH2>Design</TitleH2>
      <P>
        Coding in English consults with{" "}
        <a href="https://www.linkedin.com/in/ericengelmann/">Eric Engelmann</a>{" "}
        in the design and layout of our website. Without him, the site would be
        pretty ugly. Eric is a senior and seasoned product and project manager
        with excellent design sense.
      </P>
      <TitleH2>Editing and Translation</TitleH2>
      <P>
        We continue to work with{" "}
        <a href="https://www.linkedin.com/in/laura-bohigas-69916394/">
          Laura Bohigas
        </a>{" "}
        for editing and translating into Spanish and Catalan. The site and
        curricula would sound strange without her patient and expert influence.
      </P>
      <TitleH2>Marketing & Quality Assurance</TitleH2>
      <P>
        And last but definitely not least, we continue to work with{" "}
        <a href="https://www.linkedin.com/in/karen-morales-engelmann-2a233146/">
          Karen Morales-Engelmann
        </a>{" "}
        for Marketing and Quality assurance. Without her, you'd never hear of
        us, and lots of things would be broken. Also, she agreed to let the
        business start. Thank God.
      </P>
      <BlockQuote>
        <P>Levantaremos un mundo mejor.</P>
        <footer>
          —Txarango{" "}
        </footer>
      </BlockQuote>
    </Main>
  );
};

export { AboutUs };
