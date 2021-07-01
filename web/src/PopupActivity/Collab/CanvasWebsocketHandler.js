import fabric from "fabric";
import { ReadAndDo } from "../../messaging";
import _ from "lodash";
import {
  OBJ_CREATE_EVENT,
  OBJ_MOVE_EVENT,
  CHANNEL,
  OBJ_MOD_EVENT,
  OBJ_DEL_EVENT,
} from "./Collab";

export class CanvasWebsocketHandler {
  /**
   * Binds pre-created Canvas objects to websocket and synchronizes local and remote canvases.
   *
   * @param {*} canvasObjects Canvas objects.
   * @param {*} exerciseObjectProperties These specify whether students can modify canvas objects
   * @param {*} websocket The websocket used to send object event data.
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

  bindCanvasChanges = () => {
    /**
     * these include object added and path added.
     */
    this.canvasObjectCreator.canvas.on("object:added", (e) => {
      /**
       * If the object was added as a result of a remote canvas add, ignore it.
       * Avoids infinite loop.
       */
      if (e.target?.remoteAdd) return;
      /**
       * Paths don't get an id assigned to them upon creation, so we have to
       * do it here. And all the other stuff.
       */
      if (e.target.type === "path") {
        e.target = this.canvasObjectCreator.addPath(e.target);
      }
      const canvasObject = e.target;
      this.bindObjectChanges(canvasObject);
      const objectDef = JSON.stringify(canvasObject.toJSON(["id"]));
      console.log(
        'canvas.on("object:added" serialized for broadcast:',
        objectDef
      );
      this.broadcastChange({ et: OBJ_CREATE_EVENT, objectDef });
    });
    this.canvasObjectCreator.canvas.on("object:removed", (e) => {
      this.broadcastChange({ et: OBJ_DEL_EVENT, objectId: e.target.id });
    });

    const onCustomChange = (e) => {
      const { objId, data } = e;
      this.broadcastChange({ et: OBJ_MOD_EVENT, objectId: objId, mod: data });
    };

    const handleCustomChange = _.throttle(onCustomChange, 200);

    this.canvasObjectCreator.canvas.on(
      "object:fillColorChange",
      handleCustomChange
    );
  };
  /**
   * Binds change events on objects to their changeMessages, to be delivered to handleRemoteChanges() method on
   * the receiving clients.
   * @param {*} canvasObj The canvasObj that has been changed on the canvas.
   */
  bindObjectChanges = (canvasObj) => {
    const onObjectMove = (e) => {
      const { top, left } = e.transform.target;
      const objectId = e.transform.target.id;
      const et = OBJ_MOVE_EVENT;
      this.broadcastChange({ et, objectId, top, left });
    };
    const handleObjectMove = _.throttle(onObjectMove, 200);
    const handleMod = (e) => {
      const objectId = e.transform.target.id;
      const modAction = e.transform.target;
      const et = OBJ_MOD_EVENT;
      this.broadcastChange({ et, objectId, mod: modAction });
    };
    const handleModThrottled = _.throttle(handleMod, 200);
    canvasObj.on({
      moving: handleObjectMove,
      scaling: handleModThrottled,
      skewing: handleModThrottled,
      rotating: handleModThrottled,
    });
  };

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
    if (et === OBJ_MOD_EVENT) {
      const { objectId, mod } = changeObj;
      changeMessage = JSON.stringify({
        ch: CHANNEL,
        et: OBJ_MOD_EVENT,
        cid: this.userId,
        oid: objectId,
        data: mod,
      });
    }
    if (et === OBJ_DEL_EVENT) {
      const { objectId } = changeObj;
      changeMessage = JSON.stringify({
        ch: CHANNEL,
        et: OBJ_DEL_EVENT,
        cid: this.userId,
        oid: objectId,
      });
    }
    console.log(`broadcasting object event type ${et}`, changeMessage);
    this.websocket.send(changeMessage);
  };

  handleRemoteChanges = (eventData) => {
    if (!eventData.hasOwnProperty("et")) return;
    const { et: eventType } = eventData;
    if (eventType === OBJ_MOVE_EVENT) {
      const { oid, c } = eventData;
      console.log("received move event for oid", oid, c);
      const targetObj = this.canvasObjectCreator.objectCache[oid];
      targetObj.top = c[0];
      targetObj.left = c[1];
      targetObj.setCoords();
      this.canvasObjectCreator.objectCache[oid].canvas.renderAll();
    }
    if (eventType === OBJ_CREATE_EVENT) {
      const objToAdd = JSON.parse(eventData.od);
      console.log("received create event for object", objToAdd);
      fabric.fabric.util.enlivenObjects([objToAdd], (o) => {
        const obj = o[0];
        const origRenderOnAddRemove = this.canvasObjectCreator.canvas
          .renderOnAddRemove;
        this.canvasObjectCreator.canvas.renderOnAddRemove = false;
        obj.set({ remoteAdd: true }); // prevents infinite loop between local and remote canvases; see broadcastCanvasChanges()
        this.canvasObjectCreator.addCanvasObject(obj);
        this.bindObjectChanges(obj);
        this.canvasObjectCreator.canvas.renderOnAddRemove = origRenderOnAddRemove;
      });
    }
    if (eventType === OBJ_MOD_EVENT) {
      const { oid, data } = eventData;
      console.log("Received mod event for oid", oid, data);
      this.canvasObjectCreator.objectCache[oid].set(data);
      this.canvasObjectCreator.objectCache[oid].setCoords();
      this.canvasObjectCreator.objectCache[oid].canvas.requestRenderAll();
    }
    if (eventType === OBJ_DEL_EVENT) {
      const { oid } = eventData;
      console.log("Received del event for oid", oid);
      const targetObj = this.canvasObjectCreator.objectCache[oid];
      this.canvasObjectCreator.objectCache[oid].canvas.remove(targetObj);
      delete this.canvasObjectCreator.objectCache[oid];
      this.canvasObjectCreator.onDelete(oid);
    }
  };

  applyExerciseProperties = (o, object) => {
    const exercisePropertiesObj = this.exerciseObjectProperties[object.id];
    // we can probably move this to a mobx callback since we already have
    // all object data stored in the mobx store.
    this.canvasObjectCreator.objectCache[object.id] = object;
    if (exercisePropertiesObj) object.set(exercisePropertiesObj);
    this.canvasObjectCreator.applyGenericAttrs(object);
    this.bindObjectChanges(object);
    this.canvasObjectCreator.onAdd(object);
  };

  listenForRemoteChanges = () => {
    const readAndDo = new ReadAndDo(this.handleRemoteChanges);
    this.websocket.addEventListener("message", readAndDo.read);
  };
}
