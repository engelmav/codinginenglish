import React, { useState } from "react";
import { Main, ContentSection } from "../UtilComponents";
import { observer } from "mobx-react";
import ModuleCard from "../ModuleCard/ModuleCard";

const UpcomingSessions = observer((props) => {
  const { cieModules } = props;

  return (
    <>
      {cieModules.map((moduleData, i) => (
        <ModuleCard key={i} moduleData={moduleData} />
      ))}
    </>
  );
});

export default UpcomingSessions;
