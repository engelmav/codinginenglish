import React from 'react';
import settings from '../settings';
import {
  Main,
  Title,
  ContentSection
} from '../UtilComponents';
import styled from 'styled-components';
import { Link } from 'react-router-dom';


import { lightGray, orangeBgColor } from '../UtilComponents/sharedStyles'


const MainLanding = styled(Main)`
  width: 40%;
  padding-bottom: 60px;
`;

const ContentSectionLanding = styled(ContentSection)`
  padding-bottom: 20px;
  line-height: 1.5em;
`;


const BlockQuote = styled.blockquote`
  ${lightGray}
  font-family: serif;
  font-style: oblique;
  font-size: 1.5em;

  background: #f9f9f9;
  border-left: 10px solid #ccc;
  margin: 1.5em 10px;
  padding: 0.5em 10px;

  &:before {
    color: #ccc;
    content: open-quote;
    font-size: 2em;
    line-height: 0.1em;
    margin-right: 0.25em;
    vertical-align: -0.4em;
  }
`;


const I = styled.p`
  font-style: italic;
`;

const ImgContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
`;


const RegisterLink = styled(Link)`
  ${orangeBgColor}
  text-decoration: none;
  display: inline-block;
  width: 
  text-align: center;
  padding: 10px;
  color: white;
  a {
    color: #3d3636;
    
  }
`;

const RegisterButton = () => <div style={{textAlign:"center"}}><RegisterLink to="/classes">Go to classes >></RegisterLink></div>;


const Home = (props) => {
  return (
    <MainLanding>
      <Title fontFamily="Courier, Monaco, monospace" textAlign="center" fontSize='4em'>coding_in_english</Title>
      <ContentSection>
        <BlockQuote>
          "As a foreign student, learning any subject ... was extremely tough. In order to learn, I needed to understand a basic tool 
          first: English."
        </BlockQuote>
        <Title textAlign="center" margin="35px">
          Jump into the global mainstream. Learn English while you learn to code.
        </Title>
        <RegisterButton />
        <hr style={{ marginTop: '50px', marginBottom: '50px', width: "50%" }} />
      </ContentSection>
      <Title textAlign="center">Build Technical and Conversational Fluency</Title>
      <ContentSectionLanding>
        <p>You practice conversation in every class, specifically on software engineering.</p>
        <p>
          Topics range from working with product managers, co-workers, clients, performing code reviews, asking questions on forums, 
          reading documentation, and many more.
        </p>
        <I>And build real software in the process.</I>
        <RegisterButton />
      </ContentSectionLanding>
      <Title textAlign="center">Create Your Technical Portfolio</Title>
      <ContentSectionLanding>
        <p>Build your portfolio as you go.</p>
        <p>
          All your work in classes is yours, for display in your portfolio WebApp. Show-off to potential employers your skills in ReactJS,
          Python, and MySQL, with professional code in a GitHub repository, and a real, deployed WebApp.
        </p>
        <ImgContainer>
          {['react-logo-150.png', 'python-logo-150.png', 'mysql-logo-150.png'].map(src => 
            <img style={{height: '150px'}} src={`${settings.assets}/${src}`} />)}
        </ImgContainer>
        <RegisterButton />
      </ContentSectionLanding>
      <Title textAlign="center">Learn Vocabulary and Grammar in a Real Context</Title>
      <ContentSectionLanding>
        <p>
          We supplement all courses with grammar and vocabulary practices, tightly integrated into technical lessons.
        </p>
        <RegisterButton />
      </ContentSectionLanding>
      <Title textAlign="center">Learn in a Live Teaching Environment</Title>
      <ContentSectionLanding>
        <p>
          With so many classes moving to massive open online courses, students are left to learn in isolation. We bring back the warmth,
          motivation, and community that online classes are currently lacking. Do pair work activities in class, ask your instructor questions,
          laugh, and share your doubts and your accomplishments!
        </p>
        <RegisterButton />
      </ContentSectionLanding>
    </MainLanding>
  );
}


export { Home };