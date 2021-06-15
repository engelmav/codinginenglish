import React from "react";
import styled from "styled-components";
import { Button } from "../UtilComponents/Button";

const ActivityBorder = styled.div`
  background: white;
  border: 1px black solid;
  width: 800px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;

export const PopupActivity = ({
  appStore,
  onClose,
  activities,
  Collab,
  MultipleChoice,
  DragToImageCollab,
  websocket,
}) => {
  // Resume here:
  // implement callback (or mobx class) to collect responses from child component
  // and send them to backend when student clicks "DONE!"
  return (
    <ActivityBorder>
      {activities.map((activity, idx) => {
        const { activityType, model } = activity;
        if (activityType === "multipleChoice") {
          return <MultipleChoice key={idx} {...model} />;
        } else if (activityType === "dragAndDropToImageCollab") {
          return (
            <DragToImageCollab
              key={idx}
              model={model}
              websocket={websocket}
              activeSessionId={appStore.activeSessionId}
            />
          );
        } else if (activityType === "collab") {
          return (
            <Collab
              key={idx}
              model={model}
              websocket={websocket}
            />
          );
        } else {
          return <div></div>;
        }
      })}
      <Footer>
        <Button m={2} justifySelf="center" onClick={onClose}>
          DONE!
        </Button>
      </Footer>
    </ActivityBorder>
  );
};
