import React, { useEffect, useState } from "react";
import { Main, Title } from "../UtilComponents";
import { observer } from "mobx-react";
import { cieApi } from "../services/cieApi"

const UpcomingSessions = observer((props) => {
  const { cieModules, ModuleCard } = props;
  return (
    <Main p={20}>
      <Title alignSelf="center" mb={3}>
        Upcoming Sessions
      </Title>
      {cieModules.map((moduleData, i) => (
        <ModuleCard key={i} moduleData={moduleData} />
      ))}
    </Main>
  );
});


export default UpcomingSessions;
