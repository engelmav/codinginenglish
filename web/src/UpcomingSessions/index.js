import React from "react";
import { Main, Title } from "../UtilComponents";
import { observer } from "mobx-react";
import ModuleCard from "../ModuleCard/ModuleCard"

const UpcomingSessions = observer((props) => {
  const { cieModules } = props;
  return (
    <Main p={20}>
      <Title textAlign="center" mb={3}>
        Upcoming Sessions
      </Title>
      {cieModules.map((moduleData, i) => (
        <ModuleCard key={i} moduleData={moduleData} />
      ))}
    </Main>
  );
});


export default UpcomingSessions;
