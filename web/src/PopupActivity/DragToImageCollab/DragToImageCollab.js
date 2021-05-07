import React, { useEffect } from "react";

import styled from "styled-components";
import { drawCanvas } from "./canvasUtil";

const S = {
  canvas: styled.div`
    border: 3px black solid;
    width: 800px;
    height: 800px;
  `,
};

export const DragToImageCollab = ({
  appStore,
  model,
  settings,
  websocket,
  activeSessionId,
  createWebsocket,
}) => {
  useEffect(() => {
    async function init() {
      await drawCanvas(model, settings, websocket, appStore.userId);
    }
    init();
  }, []);
  return <S.canvas id="drag-to-image-collab" />;
};
