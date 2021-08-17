import React from "react";
import {
  Main,
  ContentSection
} from "./UtilComponents";
import {
  TitleH1,
  TitleH2,
  P
} from "./UtilComponents/Typography/Typography";
import BlockQuote from "./UtilComponents/BlockQuote";

const topMargin = 4;

const AboutUs = () => {
  return (
    <Main p={20}>
      <ContentSection>
        <TitleH1>About Us</TitleH1>
        <P>
          Coding in English is born of one passionate and principal belief: that
          all people have the right to -- and the possibility of -- achieving a
          better life, and a better livelihood. To this end, the instructors of
          Coding in English teach both English and programming, dedicated to
          espousing the ideals of kindness, encouragement, and the thrill of
          pedagogy.
        </P>
      </ContentSection>

      <ContentSection mt={4}>
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
      </ContentSection>

      <ContentSection mt={topMargin}>
        <TitleH2>Design</TitleH2>
        <P>
          Coding in English consults with{" "}
          <a href="https://www.linkedin.com/in/ericengelmann/">Eric Engelmann</a>{" "}
          in the design and layout of our website. Without him, the site would be
          pretty ugly. Eric is a senior and seasoned product and project manager
          with excellent design sense.
        </P>
      </ContentSection>

      <ContentSection mt={topMargin}>
        <TitleH2>Editing & Translation</TitleH2>
        <P>
          We continue to work with{" "}
          <a href="https://www.linkedin.com/in/laura-bohigas-69916394/">
            Laura Bohigas
          </a>{" "}
          for editing and translating into Spanish and Catalan. The site and
          curricula would sound strange without her patient and expert influence.
        </P>
      </ContentSection>

      <ContentSection mt={topMargin}>
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
      </ContentSection>

      <ContentSection>
        <BlockQuote>
          <P>Levantaremos un mundo mejor.</P>
          <footer>—Txarango </footer>
        </BlockQuote>
      </ContentSection>
    </Main>
  );
};

export default AboutUs;
