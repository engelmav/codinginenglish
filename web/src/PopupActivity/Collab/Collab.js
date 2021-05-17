import React, { useState, useEffect } from "react";
import fabric from "fabric";
import styled from "styled-components";
import { Button } from "../../UtilComponents";

class PostProcess {
  constructor(canvasObjects, exerciseObjectProperties) {
    this.canvasObjects = canvasObjects;
    this.exerciseObjectProperties = exerciseObjectProperties;
    this.applyProperties = this.applyProperties.bind(this);
  }
  applyProperties(o, object) {
    const exercisePropertiesObj = this.exerciseObjectProperties.find(
      (eop) => (eop.uuid = object.id)
    );
    if (exercisePropertiesObj) object.set(exercisePropertiesObj);
  }
}

const CollabContainer = styled.div`
  display: flex;
  border: 1px black solid;
`;
const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-items: stretch;
`;

export const Collab = ({
  appStore,
  model,
  settings,
  websocket,
  activeSessionId,
  createWebsocket,
}) => {
  const { canvasData, exerciseObjectProperties, studentDrawOptions } = model;
  console.log("jsonModel:", model);
  useEffect(() => {
    async function init() {
      const pp = new PostProcess(canvasData, exerciseObjectProperties);
      const canvas = new fabric.fabric.Canvas("canvas");
      canvas.loadFromJSON(
        canvasData,
        canvas.renderAll.bind(canvas),
        pp.applyProperties
      );
    }
    init();
  }, []);
  const [drawOn, setDrawOn] = useState(false);
  const toggleDrawMode = () => {};
  const addText = () => {};
  const addImage = () => {};
  const addCircle = () => {};
  const addRectangle = () => {};
  return (
    <CollabContainer>
      <canvas id="canvas" width={800} height={600} />
      <Toolbar>
        {Object.keys(studentDrawOptions).map((drawOption) => {
          switch (drawOption) {
            case "freeDraw":
              return (
                <Button onClick={toggleDrawMode} mb={1}>
                  {drawOn ? "Stop Drawing": "Start Drawing"}
                </Button>
              );
            case "addText":
              return (
                <Button mb={1} onClick={addText}>
                  Text
                </Button>
              );
            case "addImages":
              return (
                <Button mb={1} onClick={addImage}>
                  Add Image
                </Button>
              );
            case "addShapes":
              return (
                <>
                  <Button mb={1} onClick={addCircle}>
                    Add Circle
                  </Button>
                  <Button mb={1} onClick={addRectangle}>
                    Add Rectangle
                  </Button>
                </>
              );
          }
          return;
        })}
      </Toolbar>
    </CollabContainer>
  );
};
