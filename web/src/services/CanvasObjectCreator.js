import fabric from "fabric";
import { nanoid } from "nanoid";

export class CanvasObjectCreator {
  constructor(canvas, setSelectedObject, onAdd, onDelete) {
    this.canvas = canvas;
    this.setSelectedObject = setSelectedObject;
    this.onAdd = onAdd;
    this.onDelete = onDelete;
    this.objectCache = {};
  }
  uniqueId = () => {
    return nanoid();
  };

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
  };
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
  };

  startDrawing = () => {
    this.canvas.isDrawingMode = true;
  };
  stopDrawing = () => {
    this.canvas.isDrawingMode = false;
  };

  addPath = (pathObj) => {
    pathObj.id = this.uniqueId();
    this.applyGenericAttrs(pathObj);
    this.objectCache[pathObj.id] = pathObj;
    this.onAdd(pathObj);
    return pathObj;
  };

  deleteObject = (objId = null) => {
    console.log("CanvasObjectCreator.deleteObject()", objId)
    let id;
    if (objId){
      id = objId;
    } else {
      const activeObj = this.canvas.getActiveObject();
      const { id } = activeObj;
      this.canvas.remove(activeObj);
    }
    this.onDelete(id);
  };

  bringForward = () => {
    this.canvas.bringForward(this.canvas.getActiveObject());
    this.canvas.renderAll();
  };

  bringBackward = () => {
    this.canvas.sendBackwards(this.canvas.getActiveObject());
    this.canvas.renderAll();
  };

  setActiveObjectFillColor = (color) => {
    
    const obj = this.canvas.getActiveObject();
    obj.set({ fill: color });
    // this.state.currentColor = color.hex;
    this.canvas.renderAll();
    this.canvas.fire("object:fillColorChange", { objId: obj.id, data: {fill: color } });
    
  };
}
