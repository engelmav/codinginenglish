import React from "react";
import { styled } from "@linaria/react";
import { bg, p } from "../styling"


const H1 = styled.h1`
  font-size: 54px;
  ${bg(["red", "yellow", "violet"])}
  ${p([1, 2])}
`;
const CustomH1 = styled(H1)`
  ${bg(["green", "orange"])}
  
`

/* ... this worked --   padding-bottom: ${pFunc}px; */
//  ... this worked too -- ${bpObj}

const LandingPage = (props) => {
  const { landingPageContent: content } = props;
  return (
    <div>
      <H1>{content.title}</H1>

      <CustomH1>{content.subtitle}</CustomH1>

      {content.subsubtitle}

      {content.heroCta1}

      {content.Section.map((section, idx) => (
        <div>
          {section.sectionTitle}
          {section.sectionContent}
          {JSON.stringify(section.imageData)}
          {JSON.stringify(section.buttonData)}
        </div>
      ))}
      {content.quote[0].quoteText}

      {content.quote[0].sourceLink}
      {content.quote[0].sourceLinkText}
    </div>
  );
};

export default LandingPage;
