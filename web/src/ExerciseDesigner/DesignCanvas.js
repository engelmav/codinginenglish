import React from "react";
import fabric from "fabric";

import { CanvasObjectCreator } from "../services/CanvasObjectCreator";
import { CanvasAndToolbar, Toolbar } from "./styles";

class DesignCanvas extends React.Component {
  state = {
    renderReady: false,
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

  canvasObjectCreator = null;

  componentDidMount() {
    const canvas = new fabric.fabric.Canvas("c");
    const canvasObjectCreator = new CanvasObjectCreator(
      canvas,
      this.setSelectedObject,
      this.addObjectToState
    );

    console.log(this);
    this.setState({ canvas, canvasObjectCreator }, () =>
      this.setState({ renderReady: true })
    );
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

  addObjectToState = (obj) => {
    const _id = obj.id;
    const newObj = { lockMovementX: true, lockMovementY: true };
    const newObjects = {
      ...this.state.objects,
      [_id]: newObj,
    };
    this.setState({ objects: newObjects });
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
    const {
      canvas,
      selectedObjectId,
      renderReady,
      canvasObjectCreator,
    } = this.state;
    let selectedObj;
    if (selectedObjectId) {
      selectedObj = this.state.objects[selectedObjectId];
    } else {
      selectedObj = null;
    }
    let isMovable;
    if (selectedObj) {
      isMovable = !selectedObj.lockMovementX && !selectedObj.lockMovementY;
    } else {
      isMovable = false;
    }

    console.log(canvasObjectCreator);
    return (
      <CanvasAndToolbar>
        <canvas
          id="c"
          style={{ border: "1px solid black", display: "flex" }}
          width={800}
          height={600}
          onLoad={() => console.log("canvas loaded")}
        />
        <Toolbar>
          
          {this.state.canvas && (
            <button onClick={this.handleDrawing}>
              {this.state.isDrawingMode ? "Stop Drawing" : "Start Drawing"}
            </button>
          )}
          <button onClick={canvasObjectCreator.addText}>Text</button>
        </Toolbar>
      </CanvasAndToolbar>
    );
  }
}

export { DesignCanvas };
