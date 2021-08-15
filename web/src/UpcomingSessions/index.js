import React from "react";
import {
  Main,
  Title,
ContentSection
} from "../UtilComponents";
import {
  TitleH1,
  TitleH2,
  P
} from "../UtilComponents/Typography/Typography";
import { observer } from "mobx-react";
import ModuleCard from "../ModuleCard/ModuleCard"

const UpcomingSessions = observer((props) => {
  const { cieModules } = props;
  return (
    <Main p={20}>
      <ContentSection>
        <TitleH1 textAlign="center">Upcoming Sessions</TitleH1>
      </ContentSection>

      <ContentSection>
        {cieModules.map((moduleData, i) => (
          <ModuleCard key={i} moduleData={moduleData} />
        ))}
      </ContentSection>
    </Main>
  );
});


export default UpcomingSessions;
