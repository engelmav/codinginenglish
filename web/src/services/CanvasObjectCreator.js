import fabric from "fabric";
import { nanoid } from "nanoid";

export class CanvasObjectCreator {
  constructor(canvas, setSelectedObject, onAdd) {
    this.canvas = canvas;
    this.setSelectedObject = setSelectedObject;
    this.onAdd = onAdd;
    this.objectCache = {};
  }
  setCanvas(canvas) {
    this.canvas = canvas;
  }
  applyGenericAttrs = (canvasObj) => {
    canvasObj.set({
      onDeselect: () => this.setSelectedObject(null),
      onSelect: () => {
        this.setSelectedObject(canvasObj.id);
      },
    });
    return canvasObj;
  };
  addCanvasObject = (canvasObj) => {
    const canvasObjNormalized = this.applyGenericAttrs(canvasObj);
    this.canvas.add(canvasObjNormalized);
    console.log("object added to canvas", this.canvas)
    this.objectCache[canvasObjNormalized.id] = canvasObjNormalized;
    if (!canvasObjNormalized.remoteAdd)
      this.canvas.setActiveObject(canvasObjNormalized);
    this.canvas.renderAll();
    this.onAdd(canvasObjNormalized);
    this.canvas.renderAll();
  };

  createCircle = () => {
    const uuid = nanoid();
    const circ = new fabric.fabric.Circle({
      id: uuid,
      left: 100,
      top: 100,
      radius: 50,
      fill: "black",
    });
    this.addCanvasObject(circ);
  };
  createRectangle = () => {
    const uuid = nanoid();
    const rect = new fabric.fabric.Rect({
      id: uuid,
      left: 100,
      top: 100,
      width: 50,
      height: 50,
    });
    this.addCanvasObject(rect);
  };
  createImage = (imgUrl) => {
    const uuid = nanoid();
    const _ = fabric.fabric.Image.fromURL(imgUrl, (img) => {
      var img1 = img.set({
        id: uuid,
        left: 0,
        top: 0,
      });
      this.addCanvasObject(img1);
    });
  };
  addLock = (canvasObj) => {
    return canvasObj;
  } 
  addText = () => {
    const uuid = nanoid();
    const text = new fabric.fabric.IText("double-click to edit", {
      id: uuid,
      fontFamily: "arial black",
      fontSize: 16,
      left: 100,
      top: 100,
      fill: "black",
    });
    this.addCanvasObject(text);
  }

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
