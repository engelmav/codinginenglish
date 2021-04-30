/**
 * OMG. This thing needs to synch with websockets. OMG.
 */

/**
 *
 * Will need to take some sort of websockets service subscribed to its topic.
 * It's topic will hjave to be the activeSessionId + the activity id. (activity Id?!?)
 */

import React, { useEffect, useRef } from "react";

import styled from "styled-components";
import {
  drawCanvas
} from "./canvasUtil";

const S = {
  canvas: styled.div`
    border: 3px black solid;
    width: 600px;
    height: 600px;
  `,
};

export const DragToImageCollab = ({ settings, websocket }) => {
  /**
   * this thing will have to have some sort of assetId or activityId.
   * when queried from the backend, it'll return the "definition" of the
   * activity. e.g. images: [{imageUrl: url, pos: {x: xval, y: yval}}]
   */
  const canvasSpec = {
    images: [
      {
        imageSource: "/activities/dragToImage/basic-01-horse.gif",
        pos: { x: 3, y: 49 },
      },
    ],
  };

  useEffect(() => {
    async function init() {
      await drawCanvas(canvasSpec, settings, websocket);
    }
    init();
  });
  return <S.canvas id="drag-to-image-collab" />;
};

