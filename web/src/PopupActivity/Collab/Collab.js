import React, { useState, useEffect } from "react";
import fabric from "fabric";
import { Button } from "../../UtilComponents";
import Dialog from "@material-ui/core/Dialog";
import { CanvasObjectCreator } from "../../services/CanvasObjectCreator";
import * as S from "./styles";
import { CanvasWebsocketHandler } from "./CanvasWebsocketHandler";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";

class CollabStore {
  @observable allowAddImages = true;
  @observable allowAddShapes = true;
  @observable allowAddText = true;
  @observable allowFreeDraw = true;
  @observable drawOn = false;
  @observable exerciseTitle = "";
  saveExercise = () => {}
}

const collabStore = new CollabStore();

export const CHANNEL = "e01"; // exercise 01
export const OBJ_MOVE_EVENT = 0;
export const OBJ_CREATE_EVENT = 1;

export const Collab = ({
  appStore,
  model,
  settings,
  websocket,
  activeSessionId,
  createWebsocket,
  editorMode = false,
}) => {
  const { canvasData, exerciseObjectProperties, studentDrawOptions } = model;

  /**Editor mode */
  const handleSetExerciseTitle = (e) => {
    setExericseTitle(e.target.value);
  };
  const [canvas, setCanvas] = useState(null);
  const [canvasObjectCreator, setCanvasObjectCreator] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [canvasObjects, setCanvasObjects] = useState({});
  const addCanvasObjectToState = (_id, obj) => {
    const newObjects = {
      ...canvasObjects,
      [_id]: obj,
    };
    setCanvasObjects(newObjects);
  };

  const toggleDrawMode = () => {};

  useEffect(() => {
    async function init() {
      setCanvas(new fabric.fabric.Canvas("canvas"));
    }
    init();
  }, []);

  useEffect(() => {
    console.log("in second useEffect");
    if (canvas !== null) {
      setCanvasObjectCreator(
        new CanvasObjectCreator(null, setSelectedObject, addCanvasObjectToState)
      );
    }
  }, [canvas]);

  useEffect(() => {
    if (canvasObjectCreator) {
      const canvasWebsocketHandler = new CanvasWebsocketHandler(
        canvasData,
        exerciseObjectProperties,
        websocket,
        appStore.userId,
        canvasObjectCreator
      );
      canvas.loadFromJSON(
        canvasData,
        () => {
          console.log("completed loading JSON");
          canvas.renderAll.bind(canvas);
          canvasObjectCreator.setCanvas(canvas);
          canvasWebsocketHandler.listenForRemoteCanvasChanges();
          canvasWebsocketHandler.broadcastCanvasChanges();
        },
        canvasWebsocketHandler.applyExerciseProperties
      );
    }
  }, [canvasObjectCreator]);
  const toolbarProps = {
    canvasObjectCreator,
    studentDrawOptions,
    editorMode,
  };
  return (
    <S.CollabContainer>
      {editorMode && (
        <>
          <h1>Exercise Designer</h1>
          <label>
            Title:
            <input
              type="text"
              placeholder="exercise title"
              onChange={(e) => (collabStore.exerciseTitle = e.target.value)}
            />
          </label>
          <Button
            disabled={collabStore.exerciseTitle === ""}
            onClick={() => saveExercise()}
          >
            Save Exercise
          </Button>
        </>
      )}
      <canvas
        style={{ border: "1px black solid" }}
        id="canvas"
        width={600}
        height={600}
      />
      {canvasObjectCreator && <Toolbar {...toolbarProps} />}
    </S.CollabContainer>
  );
};

const Toolbar = ({ editorMode, studentDrawOptions, canvasObjectCreator }) => {
  return (
    <S.Toolbar>
      {editorMode && (
        <>
          <label>Allow students to:</label>
          <label>
            <input
              type="checkbox"
              onChange={() =>
                (collabStore.allowAddImages = !collabStore.allowAddImages)
              }
              checked={collabStore.allowAddImages}
            />
            Add Images
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() =>
                (collabStore.allowAddShapes = !collabStore.allowAddShapes)
              }
              checked={collabStore.allowAddShapes}
            />
            Add Shapes
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() =>
                (collabStore.allowAddImages = !collabStore.allowAddImages)
              }
              checked={collabStore.allowAddText}
            />
            Add Text
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() =>
                (collabStore.allowFreeDraw = !collabStore.allowGreeDraw)
              }
              checked={collabStore.allowFreeDraw}
            />
            Free Draw
          </label>
        </>
      )}
      {Object.keys(studentDrawOptions).map((drawOption) => {
        switch (drawOption) {
          case "freeDraw" || editorMode:
            return (
              <Button onClick={canvasObjectCreator.handleDrawing} mb={1}>
                {collabStore.drawOn ? "Stop Drawing" : "Start Drawing"}
              </Button>
            );
          case "addText" || editorMode:
            return (
              <Button mb={1} onClick={canvasObjectCreator.addText}>
                Text
              </Button>
            );
          case "addImages" || editorMode:
            return (
              <Button mb={1} onClick={canvasObjectCreator.addImage}>
                Add Image
              </Button>
            );
          case "addShapes" || editorMode:
            return (
              <>
                <Button mb={1} onClick={canvasObjectCreator.createCircle}>
                  Add Circle
                </Button>
                <Button mb={1} onClick={canvasObjectCreator.createRectangle}>
                  Add Rectangle
                </Button>
              </>
            );
        }
        return;
      })}
    </S.Toolbar>
  );
};
