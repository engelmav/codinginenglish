import React from "react";
import PropTypes from "prop-types";
import fabric from "fabric";
import Dialog from "@material-ui/core/Dialog";
import { nanoid } from "nanoid";
import styled from "styled-components";
import { CompactPicker } from "react-color";

const CanvasContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
`;

const CanvasAndToolbar = styled.div`
  display: flex;
  flex-direction: row;
`;

class DesignCanvas extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  };

  static defaultProps = {
    width: 800,
    height: 600,
  };

  state = {
    canvas: null,
    dialogOpen: false,
    temp: "",
    selectable: true,
    selectedObjectId: null,
    objects: {},
    exerciseTitle: null,

    addImages: true,
    addShapes: true,
    addText: true,
    freeDraw: true,

    isDrawingMode: false,
  };

  componentDidMount() {
    const canvas = new fabric.fabric.Canvas(this.c);
    this.setState({ canvas });
  }

  toggleAddImages = () => this.setState({ addImages: !this.state.addImages });
  toggleAddShapes = () => this.setState({ addShapes: !this.state.addShapes });
  toggleAddText = () => this.setState({ addText: !this.state.addText });
  toggleFreeDraw = () => {
    this.setState({ freeDraw: !this.state.freeDraw });
  };

  setSelectedObject = (_id) => {
    console.log("Selected Object:", _id);
    this.setState({ selectedObjectId: _id });
  };

  addObjectToState = (_id, obj) => {
    console.log("adding object", obj, "with id", _id, "to state.");
    const newObjects = {
      ...this.state.objects,
      [_id]: obj,
    };
    this.setState({ objects: newObjects });
  };

  findObject = (_id) => {
    let foundObj;
    this.state.canvas.getObjects().forEach(function (o) {
      if (o.id === _id) {
        foundObj = o;
      }
    });
    return foundObj;
  };

  setExerciseTitle = (e) => {
    this.setState({
      exerciseTitle: e.target.value /*  */,
    });
  };

  saveExercise = () => {
    const { addImages, addShapes, addText, freeDraw } = this.state;
    const savedExercise = {
      canvasData: this.state.canvas.toJSON(["id"]),
      exerciseTitle: this.state.exerciseTitle,
      exerciseObjectProperties: this.state.objects,
      studentDrawOptions: {
        addImages,
        addShapes,
        addText,
        freeDraw,
      },
    };
    console.log(JSON.stringify(savedExercise));
  };

  createCircle = () => {
    const _id = nanoid();
    const canvasCircle = new fabric.fabric.Circle({
      id: _id,
      left: 100,
      top: 100,
      radius: 50,
      fill: "black",
    });
    const circNormal = this.applyGenericAttrs(canvasCircle, _id);
    const circObj = {
      _id: _id,
      lockMovementX: true,
      lockMovementY: true,
      type: "circle",
    };
    this.addObjectToState(_id, circObj);
    this.state.canvas.add(circNormal);
    this.state.canvas.setActiveObject(circNormal);
  };

  createRectangle = () => {
    const _id = nanoid();
    const canvasRect = new fabric.fabric.Rect({
      id: _id,
      left: 100,
      top: 100,
      width: 50,
      height: 50,
    });
    const rectNormal = this.applyGenericAttrs(canvasRect, _id);
    const rectObj = {
      _id: _id,
      lockMovementX: true,
      lockMovementY: true,
      type: "rect",
    };
    this.addObjectToState(_id, rectObj);
    this.state.canvas.add(rectNormal);
    this.state.canvas.setActiveObject(rectNormal);
  };

  createImage = () => {
    const _id = nanoid();
    const _ = fabric.fabric.Image.fromURL(this.state.temp, (img) => {
      //i create an extra var for to change some image properties
      var img1 = img.set({
        id: _id,
        left: 0,
        top: 0,
        // width: 150,
        // height: 150,
      });
      const imgNormal = this.applyGenericAttrs(img1, _id);
      const obj = {
        _id,
        lockMovementX: true,
        lockMovementY: true,
      };
      this.addObjectToState(_id, obj);
      this.state.canvas.add(imgNormal);
    });

    this.setState({ dialogOpen: false, temp: "" });
  };

  bringForward = () => {
    this.state.canvas.bringForward(this.state.canvas.getActiveObject());
    this.state.canvas.renderAll();
  };

  bringBackward = () => {
    this.state.canvas.sendBackwards(this.state.canvas.getActiveObject());
    this.state.canvas.renderAll();
  };

  applyGenericAttrs = (canvasObj, _id) => {
    canvasObj.set({
      onDeselect: () => this.setSelectedObject(null),
      onSelect: () => {
        this.setSelectedObject(_id);
      },
    });
    return canvasObj;
  };

  handleDrawing = () => {
    this.state.canvas.isDrawingMode = !this.state.canvas.isDrawingMode;
    this.setState(
      {
        isDrawingMode: this.state.canvas.isDrawingMode,
      },
      () => {
        if (this.state.isDrawingMode) {
          this.state.canvas.on("path:created", (freeDraw) => {
            const _id = nanoid();
            freeDraw.path.id = _id;
            const obj = {
              _id,
              lockMovementY: true,
              lockMovementX: true,
              type: "freeDraw",
            };
            this.applyGenericAttrs(freeDraw.path, _id);
            this.addObjectToState(_id, obj);
            // this.state.canvas.renderAll();
          });
        } else {
          this.state.canvas.__eventListeners["path:created"] = [];
        }
      }
    );
  };

  handleColorChange = (color, _) => {
    const obj = this.state.canvas.getActiveObject();
    obj.set({ fill: color.hex });
    this.setState({ currentColor: color.hex });
    this.state.canvas.renderAll();
  };

  toggleAllowMovement = () => {
    const selectedObj = this.state.canvas.getActiveObject();
    console.log("got selected object", selectedObj);
    // obj.hasControls = false;
    // obj.hasBorders = false;
    // obj.editable = false;
    const { selectedObjectId } = this.state;
    console.log("Locking object", selectedObjectId);
    const { objects } = this.state;
    const { lockMovementX, lockMovementY } = objects[selectedObjectId];
    objects[selectedObjectId].lockMovementX = !lockMovementX;
    objects[selectedObjectId].lockMovementY = !lockMovementY;

    console.log("Setting new object array to:", objects);
    this.setState({
      objects: objects,
    });
  };

  setCanvasJson = (event) => {
    const json = event.target.value;
    const loadAndRender = () => {
      this.state.canvas.loadFromJSON(
        json,
        () => {
          console.log("re-rendering canvas");
          this.state.canvas.renderAll();
        },
        function (o, object) {
          console.log(o, object);
        }
      );
    };
    this.setState({ canvasJson: json }, loadAndRender);
  };

  render() {
    const { width, height } = this.props;
    const { selectedObjectId } = this.state;
    let selectedObj;
    if (selectedObjectId) {
      selectedObj = this.state.objects[selectedObjectId];
    } else {
      selectedObj = null;
    }
    console.log("render() selectedObj found in state.objects:", selectedObj);
    let isMovable;
    if (selectedObj) {
      isMovable = !selectedObj.lockMovementX && !selectedObj.lockMovementY;
    } else {
      isMovable = false;
    }
    console.log("render() isMovable:", isMovable);

    console.log(
      "render() this.state.objects:",
      JSON.stringify(this.state.objects)
    );

    return (
      <>
        <CanvasContainer>
          <h1>Exercise Designer</h1>
          <label>
            Title:
            <input
              type="text"
              placeholder="exercise title"
              onChange={this.setExerciseTitle}
            />
            <button
              disabled={!this.state.exerciseTitle}
              onClick={this.saveExercise}
            >
              Save Exercise
            </button>
          </label>
          <CanvasAndToolbar>
            <canvas
              style={{ border: "1px solid black", display: "flex" }}
              ref={(c) => (this.c = c)}
              width={width}
              height={height}
            />
            <Toolbar>
              <label>Allow students to:</label>
              <label>
                <input
                  type="checkbox"
                  onChange={this.toggleAddImages}
                  checked={this.state.addImages}
                />
                Add Images
              </label>

              <label>
                <input
                  type="checkbox"
                  onChange={this.toggleAddShapes}
                  checked={this.state.addShapes}
                />
                Add Shapes
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={this.toggleAddText}
                  checked={this.state.addText}
                />
                Add Text
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={this.toggleFreeDraw}
                  checked={this.state.freeDraw}
                />
                Free Draw
              </label>
              {this.state.canvas && (
                <button onClick={this.handleDrawing}>
                  {this.state.isDrawingMode ? "Stop Drawing" : "Start Drawing"}
                </button>
              )}
              <button
                onClick={() => {
                  const uuid = nanoid();
                  const text = new fabric.fabric.IText("Click to edit", {
                    id: uuid,
                    fontFamily: "arial black",
                    fontSize: 16,
                    left: 100,
                    top: 100,
                    fill: "black",
                  });
                  const textNormal = this.applyGenericAttrs(text, uuid);
                  const obj = {
                    _id: uuid,
                    lockMovementX: true,
                    lockMovementY: true,
                  };
                  this.addObjectToState(uuid, obj);
                  this.state.canvas.add(textNormal);
                  this.state.canvas.setActiveObject(textNormal);
                }}
              >
                Text
              </button>
              <button
                onClick={() => {
                  this.setState({ dialogOpen: true, temp: "" });
                }}
              >
                Image
              </button>
              <button onClick={this.createRectangle}>Rectangle</button>
              <button onClick={this.createCircle}>Circle</button>
              {selectedObj && (
                <div
                  style={{
                    position: "absolute",
                    zIndex: "2",
                  }}
                >
                  <div
                    style={{
                      position: "fixed",
                      top: "400px",
                      right: "0px",
                      bottom: "0px",
                      left: "0px",
                      width: "400px",
                    }}
                  >
                    <CompactPicker
                      style={{
                        position: "absolute",
                        zIndex: "2",
                      }}
                      color={this.state.currentColor}
                      onChange={this.handleColorChange}
                    />
                  </div>
                </div>
              )}
              {selectedObj && (
                <>
                  <button
                    onClick={() => {
                      const obj = this.state.canvas.getActiveObject();
                      console.log("selected object:", obj);
                      const { objects } = this.state;
                      const newObjects = delete objects[obj.id]
                      this.state.canvas.remove(obj)
                      console.log("newObjects:", newObjects);
                      this.setState({ objects: newObjects });
                      this.state.canvas.renderAll();
                    }}
                  >
                    Delete
                  </button>
                  <button onClick={this.bringBackward}>Move backward</button>
                  <button onClick={this.bringForward}>Move forward</button>
                  <label>student can:</label>
                  <label>
                    {this.state.canvas && (
                      <input
                        name="selectable"
                        type="checkbox"
                        checked={isMovable}
                        onChange={this.toggleAllowMovement}
                      />
                    )}
                  </label>
                  Move
                </>
              )}
            </Toolbar>
          </CanvasAndToolbar>
          <Dialog open={this.state.dialogOpen}>
            <input
              type="text"
              placeholder="image url"
              onChange={(e) => this.setState({ temp: e.target.value })}
            ></input>
            <button onClick={this.createImage}>Add</button>
          </Dialog>
          <textarea
            onChange={this.setCanvasJson}
            value={this.state.canvasJson}
          ></textarea>
        </CanvasContainer>
      </>
    );
  }
}

export { DesignCanvas };
