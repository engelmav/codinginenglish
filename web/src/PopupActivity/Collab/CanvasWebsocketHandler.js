import fabric from "fabric";
import { ReadAndDo } from "../../messaging";
import _ from "lodash";
import { OBJ_CREATE_EVENT, OBJ_MOVE_EVENT, CHANNEL } from "./Collab";

export class CanvasWebsocketHandler {
  /**
   * Binds pre-created Canvas objects to websocket and synchronizes local and remote canvases.
   *
   * @param {*} canvasObjects
   * @param {*} exerciseObjectProperties
   * @param {*} websocket The websocket used to send object coords on move.
   * @param {*} canvasObjectCreator Service used to create shapes and retain proxy object of canvas.
 
   */
  constructor(
    canvasObjects,
    exerciseObjectProperties,
    websocket,
    userId,
    canvasObjectCreator
  ) {
    this.canvasObjects = canvasObjects;
    this.exerciseObjectProperties = exerciseObjectProperties;
    this.websocket = websocket;
    this.userId = userId;
    this.canvasObjectCreator = canvasObjectCreator;
  }

  broadcastCanvasChanges() {
    this.canvasObjectCreator.canvas.on("object:added", (e) => {
      if (e.target?.remoteAdd)
        return; // if the object was added as a result of a remote canvas add, ignore it. Avoids infinite loop.
      const canvasObject = e.target;
      this.bindCanvasObjectToWebsocket(canvasObject);
      const objectDef = JSON.stringify(canvasObject.toJSON(["id"]));
      this.broadcastChange({ et: OBJ_CREATE_EVENT, objectDef });
    });
  }

  broadcastChange = (changeObj) => {
    const { et } = changeObj;
    let changeMessage;
    if (et === OBJ_MOVE_EVENT) {
      const { objectId, top, left } = changeObj;
      changeMessage = JSON.stringify({
        ch: CHANNEL,
        et: OBJ_MOVE_EVENT,
        cid: this.userId,
        oid: objectId,
        c: [top, left],
      });
    }
    if (et === OBJ_CREATE_EVENT) {
      const { objectDef } = changeObj;
      changeMessage = JSON.stringify({
        ch: CHANNEL,
        et: OBJ_CREATE_EVENT,
        cid: this.userId,
        od: objectDef,
      });
    }
    console.log("broadcasting change event", changeMessage);
    this.websocket.send(changeMessage);
  };

  bindCanvasObjectToWebsocket(canvasObj) {
    const onObjectMove = (e) => {
      const { top, left } = e.transform.target;
      const objectId = e.transform.target.id;
      const et = OBJ_MOVE_EVENT;
      this.broadcastChange({ et, objectId, top, left });
    };
    const handleObjectMove = _.throttle(onObjectMove, 200);
    canvasObj.on("moving", handleObjectMove);
  }

  applyExerciseProperties = (o, object) => {
    const exercisePropertiesObj = this.exerciseObjectProperties[object.id];
    this.canvasObjectCreator.objectCache[object.id] = object;
    if (exercisePropertiesObj)
      object.set(exercisePropertiesObj);
    this.bindCanvasObjectToWebsocket(object);
  };

  updateLocalCanvasFromRemote = (eventData) => {
    if (!eventData.hasOwnProperty("et"))
      return;
    if (eventData.et === OBJ_MOVE_EVENT) {
      const { oid, c } = eventData;
      const targetObj = this.canvasObjectCreator.objectCache[oid];
      targetObj.top = c[0];
      targetObj.left = c[1];
      targetObj.setCoords();
      this.canvasObjectCreator.objectCache[oid].canvas.renderAll();
    }
    if (eventData.et === OBJ_CREATE_EVENT) {
      const objToAdd = JSON.parse(eventData.od);
      fabric.fabric.util.enlivenObjects([objToAdd], (o) => {
        const obj = o[0];
        const origRenderOnAddRemove = canvas.renderOnAddRemove;
        this.canvasObjectCreator.canvas.renderOnAddRemove = false;
        obj.set({ remoteAdd: true }); // prevents infinite loop between local and remote canvases; see broadcastCanvasChanges()
        this.canvasObjectCreator.addCanvasObject(obj);
        this.bindCanvasObjectToWebsocket(obj);
        this.canvasObjectCreator.canvas.renderOnAddRemove = origRenderOnAddRemove;
      });
    }
  };
  listenForRemoteCanvasChanges = () => {
    const readAndDo = new ReadAndDo(this.updateLocalCanvasFromRemote);
    this.websocket.addEventListener("message", readAndDo.read);
  };
}
