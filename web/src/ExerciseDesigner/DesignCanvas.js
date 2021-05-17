import React from "react";
import PropTypes from "prop-types";
import fabric from "fabric";
import Dialog from "@material-ui/core/Dialog";
import { v4 as uuidv4 } from "uuid";
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
    selectedObjectUuid: null,
    objects: [],
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
  toggleFreeDraw = () => this.setState({ freeDraw: !this.state.freeDraw });

  setSelectedObject = (uuid) => {
    this.setState({ selectedObjectUuid: uuid });
  };

  findObject = (uuid) => {
    let foundObj;
    this.state.canvas.getObjects().forEach(function (o) {
      if (o.id === uuid) {
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
    const {
      addImages,
      addShapes,
      addText,
      freeDraw
    } = this.state;
    const savedExercise = {
      canvasData: this.state.canvas.toJSON(['id']),
      exerciseTitle: this.state.exerciseTitle,
      exerciseObjectProperties: this.state.objects,
      studentDrawOptions: {
        addImages,
        addShapes,
        addText,
        freeDraw
      }
    }
    console.log(JSON.stringify(savedExercise));
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
    this.setState({ objects: this.state.objects.concat(obj) });
    this.state.canvas.add(rectNormal);
    this.state.canvas.setActiveObject(rectNormal);
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
    this.setState({ objects: this.state.objects.concat(obj) });
    this.state.canvas.add(rectNormal);
    this.state.canvas.setActiveObject(rectNormal);
  };

  createImage = () => {
    {
      const uuid = uuidv4();
      const _ = fabric.fabric.Image.fromURL(this.state.temp, (img) => {
        //i create an extra var for to change some image properties
        var img1 = img.set({
          id: uuid,
          left: 0,
          top: 0,
          // width: 150,
          // height: 150,
        });
        const imgNormal = this.applyGenericAttrs(img1, uuid);
        const obj = {
          uuid,
          lockMovementX: false,
          lockMovementY: false,
        };
        this.setState({ objects: this.state.objects.concat(obj) });
        this.state.canvas.add(imgNormal);
      });

      this.setState({ dialogOpen: false, temp: "" });
    }
  };

  bringForward = () => {
    this.state.canvas.bringForward(this.state.canvas.getActiveObject());
    this.state.canvas.renderAll();
  };

  bringBackward = () => {
    this.state.canvas.sendBackwards(this.state.canvas.getActiveObject());
    this.state.canvas.renderAll();
  };

  applyGenericAttrs = (obj, uuid) => {
    obj.set({
      onDeselect: () => this.setState({ selectedObjectUuid: null }),
      onSelect: () => {
        this.setSelectedObject(uuid);
      },
    });
    return obj;
  };

  handleColorChange = (color, _) => {
    const obj = this.state.canvas.getActiveObject();
    obj.set({ fill: color.hex });
    this.state.currentColor = color.hex;
    this.state.canvas.renderAll();
  };

  lockObjectMovement = () => {
    const selectedObj = this.state.canvas.getActiveObject();
    console.log("got selected object", selectedObj);
    // obj.hasControls = false;
    // obj.hasBorders = false;
    // obj.editable = false;
    // this.state.canvas.selection = selectable;
    const { selectedObjectUuid } = this.state;
    const newObjects = this.state.objects.map((obj) => {
      if (selectedObjectUuid === obj.uuid) {
        return {
          ...obj,
          lockMovementX: !obj.lockMovementX,
          lockMovementY: !obj.lockMovementY,
        };
      }
      return obj;
    });
    console.log("setting new object array to lock:", newObjects);
    this.setState({
      objects: newObjects,
    });

    this.state.canvas.renderAll();
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
    const { selectedObjectUuid } = this.state;
    let selectedObj;
    if (selectedObjectUuid) {
      selectedObj = this.state.objects.find(
        (obj) => (obj.uuid = selectedObjectUuid)
      );
    } else {
      selectedObj = null;
    }
    let isMovable;
    if (selectedObj) {
      isMovable = selectedObj.lockMovementX && selectedObj.lockMovementY;
    } else {
      isMovable = false;
    }

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
            <button disabled={!this.state.exerciseTitle} onClick={this.saveExercise}>Save Exercise</button>
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
                <button
                  onClick={() => {
                    this.state.canvas.isDrawingMode = !this.state.canvas
                      .isDrawingMode;
                    this.setState({
                      isDrawingMode: this.state.canvas.isDrawingMode,
                    });
                  }}
                >
                  {this.state.isDrawingMode ? "Stop Drawing" : "Start Drawing"}
                </button>
              )}
              <button
                onClick={() => {
                  const uuid = uuidv4();
                  const text = new fabric.fabric.IText("Click to edit", {
                    id: uuid,
                    fontFamily: "arial black",
                    fontSize: 16,
                    left: 100,
                    top: 100,
                    fill: "#efef",
                  });
                  const textNormal = this.applyGenericAttrs(text, uuid);
                  const obj = {
                    uuid: uuid,
                    lockMovementX: true,
                    lockMovementY: true,
                  };
                  this.setState({ objects: this.state.objects.concat(obj) });
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
                      width: "400px"
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
                      const newObjList = this.state.objects.filter(
                        (fobj) => fobj.uuid !== obj.id
                      );
                      this.setState({ objects: newObjList });
                      this.state.canvas.remove(obj);
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
                        onChange={this.lockObjectMovement}
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

export default DesignCanvas;
