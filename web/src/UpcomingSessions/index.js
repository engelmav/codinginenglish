import { observer } from "mobx-react";
import ModuleCard from "../ModuleCard/ModuleCard";
import React from "react";

const UpcomingSessions = observer((props) => {
  const { cieModules, mailingListComponentContent } = props;
  return (
    <>
      {cieModules.map((moduleData, i) => (
        <ModuleCard
          key={i}
          moduleData={moduleData}
          mailingListComponentContent={mailingListComponentContent}
        />
      ))}
    </>
  );
});

export default UpcomingSessions;
