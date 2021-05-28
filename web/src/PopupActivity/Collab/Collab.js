import React, { useState, useEffect } from "react";
import fabric from "fabric";
import { Button } from "../../UtilComponents";
import Dialog from "@material-ui/core/Dialog";
import { CanvasObjectCreator } from "../../services/CanvasObjectCreator";
import * as S from "./styles";
import { CanvasWebsocketHandler } from "./CanvasWebsocketHandler";
import { SketchPicker } from "react-color";
import { computed, observable, makeObservable, toJS } from "mobx";
import { observer } from "mobx-react";
import jsonFormat from "json-format";

const mapToObj = (_map) => {
  const obj = {};
  for (let prop of _map) {
    obj[prop[0]] = prop[1];
  }
  return obj;
};

class CollabStore {
  @observable allowAddImages = true;
  @observable allowAddShapes = true;
  @observable allowAddText = true;
  @observable allowFreeDraw = true;
  @observable allowedFunctions = observable.map();
  @observable drawOn = false;
  @observable exerciseTitle = "";
  @observable dialogOpen = false;
  @observable imgUrl = "";
  @observable selectedObject = null;
  @observable currentColor = { hex: null };
  @observable canvasObjects = observable.map({});
  @observable jsonEditorOpen = false;
  @observable exerciseData = null;
  @observable editedExerciseData = null;

  constructor() {
    makeObservable(this);
  }
  saveExercise = () => {};
  openDialog = () => (this.dialogOpen = true);
  closeDialog = () => (this.dialogOpen = false);
  toggleDraw = () => (this.drawOn = !this.drawOn);
  setExerciseTitle = (title) => (this.exerciseTitle = title);
  setSelectedObject = (objectId) => {
    this.selectedObject = objectId;
    // if (objectId) this.computeIsMovable();
  };
  addCanvasObject = (obj) => {
    console.log("addCanvasObject");
    const { id } = obj;
    const detatchedFromFabric = obj.toJSON([
      "id",
      "lockMovementX",
      "lockMovementY",
    ]);
    this.canvasObjects.set(id, detatchedFromFabric);
  };

  getCanvasObjects = () => mapToObj(this.canvasObjects);

  deleteObject = (objId) => this.canvasObjects.delete(objId);

  setCurrentColor = (color) => (this.currentColor = { hex: color });

  openJsonEditor = () => (this.jsonEditorOpen = true);
  closeJsonEditor = () => (this.jsonEditorOpen = false);

  setExerciseData = (data) => (this.exerciseData = data);
  setExerciseDataDraft = (data) => (this.editedExerciseData = data);
  getAllowedFunctions = () => mapToObj(this.allowedFunctions);
  @computed get exerciseDataOrEdited() {
    const jsonEditorVal =
      this.editedExerciseData === null
        ? this.exerciseData
        : this.editedExerciseData;
    let fmtjs;
    try {
      fmtjs = jsonFormat(
        JSON.parse(jsonEditorVal),
        {
          type: "space",
          size: 1,
        },
        (err) => console.log("failed:", err)
      );
    } catch (err) {
      console.log("json parse error:", err)
       fmtjs = jsonEditorVal;
    }
    return fmtjs;
  }

  @computed get isMovableObject() {
    const selectedObj = collabStore.canvasObjects.get(
      collabStore.selectedObject
    );
    const { lockMovementX, lockMovementY } = selectedObj;
    return (
      selectedObj.lockMovementX === false && selectedObj.lockMovementY === false
    );
  }

  toggleAllowedFunction = (funcName) => {
    const val = this.allowedFunctions.get(funcName);
    if (val) this.allowedFunctions();
  };

  applyEditedExerciseData = () => {
    if (this.editedExerciseData) {
      this.exerciseData = this.editedExerciseData;
    }
  };

  toggleAllowMovement = (objId) => {
    console.log(toJS(this.canvasObjects));
    const objToUpdate = this.canvasObjects.get(objId);
    const { lockMovementX, lockMovementY } = objToUpdate;
    const updatedObj = Object.assign(objToUpdate, {
      lockMovementX: !lockMovementX,
      lockMovementY: !lockMovementY,
    });
    this.canvasObjects.set(objId, updatedObj);
  };
}

const collabStore = new CollabStore();

export const CHANNEL = "e01"; // exercise 01
export const OBJ_MOVE_EVENT = 0;
export const OBJ_CREATE_EVENT = 1;
export const OBJ_MOD_EVENT = 2;
export const OBJ_DEL_EVENT = 3;

export const Collab = observer(
  ({ appStore, model = {}, settings, websocket, editorMode = false }) => {
    const { canvasData, exerciseObjectProperties, studentDrawOptions } = model;

    /**Editor mode */
    const handleSetExerciseTitle = (e) => {
      collabStore.setExericseTitle(e.target.value);
    };
    const [canvas, setCanvas] = useState(null);
    const [canvasObjectCreator, setCanvasObjectCreator] = useState(null);

    useEffect(() => {
      async function init() {
        setCanvas(new fabric.fabric.Canvas("canvas"));
      }
      init();
    }, []);

    useEffect(() => {
      if (canvas !== null) {
        setCanvasObjectCreator(
          new CanvasObjectCreator(
            canvas,
            collabStore.setSelectedObject,
            collabStore.addCanvasObject,
            collabStore.deleteObject
          )
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
            canvas.renderAll.bind(canvas);
            canvasWebsocketHandler.listenForRemoteChanges();
            canvasWebsocketHandler.bindCanvasChanges();
          },
          canvasWebsocketHandler.applyExerciseProperties
        );
      }
    }, [canvasObjectCreator]);

    const saveExercise = () => {
      console.log("saving exercise");
      console.log(JSON.stringify(collabStore.getCanvasObjects()));
      const allowedFunctions = collabStore.getAllowedFunctions();
      const canvasJson = canvas.toJSON();
      collabStore.setExerciseData(
        JSON.stringify({
          allowedFunctions,
          canvasJson,
        })
      );
      collabStore.openJsonEditor();
    };

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
        <S.CanvasAndToolbar>
          <canvas
            style={{ border: "1px black solid" }}
            id="canvas"
            width={600}
            height={600}
          />
          {canvasObjectCreator && <Toolbar {...toolbarProps} />}
        </S.CanvasAndToolbar>
        {canvasObjectCreator && (
          <Dialogs canvasObjectCreator={canvasObjectCreator} />
        )}
      </S.CollabContainer>
    );
  }
);

/*
      
*/
const Toolbar = observer(
  ({ editorMode, studentDrawOptions, canvasObjectCreator }) => {
    const ColorPicker = (
      <div>
        <div
          style={{
            position: "absolute",
            zIndex: "2",
          }}
        >
          <div
            style={{
              position: "relative",
              top: "0",
              right: "0px",
              bottom: "0px",
              left: "0px",
              width: "400px",
            }}
          >
            <SketchPicker
              style={{
                position: "absolute",
                zIndex: "2",
              }}
              color={collabStore.currentColor}
              onChange={(color) => {
                collabStore.setCurrentColor(color.hex);
                canvasObjectCreator.setActiveObjectFillColor(color.hex);
              }}
            />
          </div>
        </div>
      </div>
    );
    const FreeDrawButton = (
      <Button
        onClick={() => {
          if (collabStore.drawOn) {
            collabStore.toggleDraw();
            canvasObjectCreator.stopDrawing();
          } else {
            collabStore.toggleDraw();
            canvasObjectCreator.startDrawing();
          }
        }}
        mb={1}
      >
        {collabStore.drawOn == true ? "Stop Drawing" : "Start Drawing"}
      </Button>
    );
    const AddTextButton = (
      <Button mb={1} onClick={canvasObjectCreator.addText}>
        Text
      </Button>
    );
    const AddImageButton = (
      <Button
        mb={1}
        onClick={() => {
          collabStore.dialogOpen = true;
        }}
      >
        Add Image
      </Button>
    );
    const AddShapesButton = (
      <>
        <Button mb={1} onClick={canvasObjectCreator.createCircle}>
          Add Circle
        </Button>
        <Button mb={1} onClick={canvasObjectCreator.createRectangle}>
          Add Rectangle
        </Button>
      </>
    );
    const SelectedObjectControls = (
      <>
        {collabStore.selectedObject && (
          <>
            <div>Change object:</div>
            {editorMode && (
              <>
                <label>student can:</label>
                {collabStore.selectedObject && (
                  <label>
                    <input
                      name="selectable"
                      type="checkbox"
                      checked={collabStore.isMovableObject}
                      onChange={() =>
                        collabStore.toggleAllowMovement(
                          canvasObjectCreator.canvas.getActiveObject().id
                        )
                      }
                    />
                    Move object
                  </label>
                )}
              </>
            )}
            <Button onClick={canvasObjectCreator.bringBackward}>
              Move backward
            </Button>
            <Button onClick={canvasObjectCreator.bringForward}>
              Move forward
            </Button>
            <Button
              pl={0}
              mb={1}
              onClick={() => canvasObjectCreator.deleteObject()}
            >
              Delete
            </Button>
            {ColorPicker}
          </>
        )}
      </>
    );

    const AllButtons = (
      <>
        {AddTextButton}
        {AddImageButton}
        {AddShapesButton}
        {SelectedObjectControls}
      </>
    );

    let ComputedButtons;
    if (editorMode) {
      ComputedButtons = AllButtons;
    } else {
      ComputedButtons = Object.keys(studentDrawOptions).map((drawOption) => {
        switch (drawOption) {
          case "freeDraw":
            return FreeDrawButton;
          case "addText":
            return AddTextButton;
          case "addImages":
            return AddImageButton;
          case "addShapes":
            return AddShapesButton;
          case "delete":
            return SelectedObjectControls;
        }
        return;
      });
    }

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
        {ComputedButtons}
      </S.Toolbar>
    );
  }
);

const Dialogs = observer(({ canvasObjectCreator }) => {
  return (
    <>
      <Dialog open={collabStore.dialogOpen}>
        <input
          type="text"
          placeholder="image url"
          onChange={(e) => (collabStore.imgUrl = e.target.value)}
        ></input>
        <Button
          onClick={() => {
            canvasObjectCreator.createImage(collabStore.imgUrl);
            collabStore.closeDialog();
            collabStore.imgUrl = "";
          }}
        >
          Add
        </Button>
      </Dialog>
      <Dialog open={collabStore.jsonEditorOpen}>
        <textarea
          rows="200"
          cols="200"
          value={collabStore.exerciseDataOrEdited}
          onChange={(e) => {
            collabStore.setExerciseDataDraft(e.target.value);
          }}
        >
          {collabStore.exerciseData}
        </textarea>
        <Button
          onClick={() => {
            collabStore.applyEditedExerciseData();
            canvasObjectCreator.canvas.loadFromJSON(
              JSON.parse(collabStore.exerciseData).canvasJson
            );
            collabStore.closeJsonEditor();
          }}
        >
          Apply
        </Button>
      </Dialog>
    </>
  );
});
