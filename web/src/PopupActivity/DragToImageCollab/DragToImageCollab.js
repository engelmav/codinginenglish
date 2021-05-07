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

export const DragToImageCollab = ({ appStore, model, settings, websocket, activeSessionId, createWebsocket }) => {
  /**
   * this thing will have to have some sort of assetId or activityId.
   * when queried from the backend, it'll return the "definition" of the
   * activity. e.g. images: [{imageUrl: url, pos: {x: xval, y: yval}}]
   */

  useEffect(() => {
    async function init() {
      await drawCanvas(model, settings, websocket, appStore.userId);
    }
    init();
  });
  return <S.canvas id="drag-to-image-collab" />;
};
