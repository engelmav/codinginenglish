import React, { useState, useEffect } from "react";
import fabric from "fabric";
import styled from "styled-components";
import { Button } from "../../UtilComponents";
import Dialog from "@material-ui/core/Dialog";
import { v4 as uuidv4 } from "uuid";
import { ReadAndDo, readSocketDataAnd} from "../../messaging";

var objectCache = {};
const updateObjectLocations = (eventData) => {
  console.log("updateObjectLocations()")
  if (eventData.hasOwnProperty("et") && eventData.et === OBJ_MOVE_EVENT) {
    const { oid, c } = eventData;
    objectCache[oid].to({
      x: c[0],
      y: c[1],
      duration: 0.5,
    });
  }
}

class PostProcess {
  constructor(canvasObjects, exerciseObjectProperties) {
    this.canvasObjects = canvasObjects;
    this.exerciseObjectProperties = exerciseObjectProperties;
    this.applyProperties = this.applyProperties.bind(this);
  }
  applyProperties(o, object) {
    const exercisePropertiesObj = this.exerciseObjectProperties[object.id];
    if (exercisePropertiesObj) object.set(exercisePropertiesObj);
    object.on("moving", (e) => console.log("moving"));
    objectCache[object.id] = object;
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

  const [drawOn, setDrawOn] = useState(false);
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
  const addText = () => {};
  const addImage = () => {};
  const canvasShapes = new CanvasShapes(
    null,
    setSelectedObject,
    addCanvasObjectToState
  );

  useEffect(() => {
    async function init() {
      const pp = new PostProcess(canvasData, exerciseObjectProperties);
      const canvas = new fabric.fabric.Canvas("canvas");
      canvas.loadFromJSON(
        canvasData,
        canvas.renderAll.bind(canvas),
        pp.applyProperties
      );
      canvasShapes.canvas = canvas;
      const readAndDo = new ReadAndDo(updateObjectLocations);
      websocket.addEventListener("message", readAndDo.read);
    }
    init();
  }, []);

  return (
    <CollabContainer>
      <canvas id="canvas" width={800} height={600} />
      <Toolbar>
        {Object.keys(studentDrawOptions).map((drawOption) => {
          switch (drawOption) {
            case "freeDraw":
              return (
                <Button onClick={toggleDrawMode} mb={1}>
                  {drawOn ? "Stop Drawing" : "Start Drawing"}
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
                  <Button mb={1} onClick={canvasShapes.createCircle}>
                    Add Circle
                  </Button>
                  <Button mb={1} onClick={canvasShapes.createRectangle}>
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

class CanvasShapes {
  constructor(canvas, setSelectedObject, addToState) {
    this.canvas = canvas;
    this.setSelectedObject = setSelectedObject;
    this.addCanvasObjToState = addToState;
  }
  applyGenericAttrs = (obj, uuid) => {
    obj.set({
      onDeselect: () => this.setSelectedObject(null),
      onSelect: () => {
        this.setSelectedObject(uuid);
      },
    });
    return obj;
  };
  createCircle = () => {
    const uuid = uuidv4();
    const rect = new fabric.fabric.Circle({
      id: uuid,
      left: 100,
      top: 100,
      radius: 50,
      fill: "black",
    });
    const rectNormal = this.applyGenericAttrs(rect, uuid);
    const obj = {
      uuid: uuid,
      lockMovementX: true,
      lockMovementY: true,
    };
    this.addCanvasObjToState(obj);
    this.canvas.add(rectNormal);
    this.canvas.setActiveObject(rectNormal);
  };
  createRectangle = () => {
    const uuid = uuidv4();
    const rect = new fabric.fabric.Rect({
      id: uuid,
      left: 100,
      top: 100,
      width: 50,
      height: 50,
    });
    const rectNormal = this.applyGenericAttrs(rect, uuid);
    const obj = {
      uuid: uuid,
      lockMovementX: true,
      lockMovementY: true,
    };
    this.addCanvasObjToState(obj);
    this.canvas.add(rectNormal);
    this.canvas.setActiveObject(rectNormal);
  };
  createImage = () => {
    const uuid = uuidv4();
    const _ = fabric.fabric.Image.fromURL(this.state.temp, (img) => {
      var img1 = img.set({
        id: uuid,
        left: 0,
        top: 0,
      });
      const imgNormal = this.applyGenericAttrs(img1, uuid);
      const obj = {
        uuid,
        lockMovementX: false,
        lockMovementY: false,
      };
      this.addCanvasObjToState(obj);
      this.canvas.add(imgNormal);
    });

    this.setState({ dialogOpen: false, temp: "" });
  };

  bringForward = () => {
    this.canvas.bringForward(this.canvas.getActiveObject());
    this.canvas.renderAll();
  };

  bringBackward = () => {
    this.canvas.sendBackwards(this.canvas.getActiveObject());
    this.canvas.renderAll();
  };

  handleColorChange = (color, _) => {
    const obj = this.canvas.getActiveObject();
    obj.set({ fill: color.hex });
    // this.state.currentColor = color.hex;
    this.canvas.renderAll();
  };
}