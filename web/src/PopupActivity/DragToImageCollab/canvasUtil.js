import Konva from "konva";
import * as fastgif from "../../../node_modules/fastgif/fastgif.js";
import { readSocketDataAnd } from "../../messaging";

const CHANNEL = "active-session-01-exercise-01";
const OBJ_MOVE_EVENT = "object-move-event";

function updateCanvas(clientId, objectId, websocket, x, y) {
  websocket.send(
    JSON.stringify({
      ch: CHANNEL,
      et: OBJ_MOVE_EVENT,
      cid: clientId,
      oid: objectId,
      c: [x, y],
    })
  );
}

function addObjectListeners(websocket, canvasSpec, stage) {
  const objectCache = {};
  canvasSpec.wordBag.forEach((_, index) => {
    objectCache[`labelBox-${index}`] = stage.findOne(`#labelBox-${index}`);
  });

  function updateObjectLocations(eventData) {
    if (eventData.hasOwnProperty("et") && eventData.et === OBJ_MOVE_EVENT) {
      const { oid, c } = eventData;
      objectCache[oid].to({
        x: c[0],
        y: c[1],
        duration: 0.5,
      });
    }
  }
  const handleSocketData = (_.partial = readSocketDataAnd(
    updateObjectLocations
  ));
  websocket.addEventListener("message", handleSocketData);
}

export async function drawCanvas(canvasSpec, settings, websocket, actorId) {
  const stage = new Konva.Stage({
    width: 800,
    height: 800,
    container: "#drag-to-image-collab",
  });

  stage.on("click", function () {
    var pos = stage.getPointerPosition();
    console.log("clicked position:", pos);
  });

  const gifLayer = new Konva.Layer();
  stage.add(gifLayer);
  const layer = new Konva.Layer();

  canvasSpec.images.forEach(async (image) => {
    if (!window.WebAssembly) {
      alert(
        "Sorry, you need to use a newer version of Firefox or Chrome to view this!"
      );
    }
    const buf = await fetchToBuffer(`${settings.assets}${image.imageSource}`);
    const wasmDecoder = new fastgif.Decoder();
    const imageDataFrames = await wasmDecoder.decode(buf);
    const imageBitmapFrames = [];

    for (const frame of imageDataFrames) {
      const bitmapData = await createImageBitmap(frame.imageData);
      imageBitmapFrames.push({ imageData: bitmapData, delay: frame.delay });
    }
    renderGif(imageBitmapFrames, gifLayer, stage);
  });
  for (i = 0; i <= canvasSpec.labelBuckets.length; i++) {
    const labelBucket = canvasSpec.labelBuckets[i];
    layer.add(await LabelBucket(labelBucket.lineBegin, labelBucket.lineEnd));
  }
  for (i = 0; i <= canvasSpec.wordBag.length; i++) {
    const word = wordBag[i];
    const x = randomIntFromInterval(0, stage.width() - 300);
    const y = randomIntFromInterval(0, stage.height() - 300);
    layer.add(await LabelBox(word, x, y, i, websocket, actorId));
  }
  stage.add(layer);
  addObjectListeners(websocket, canvasSpec, stage);
}

async function LabelBucket(lineStart, lineEnd) {
  const group = new Konva.Group({
    width: 130,
    height: 25,
    rotation: 0,
    draggable: false,
  });
  const line = new Konva.Line({
    points: lineStart.concat(lineEnd),
    stroke: "black",
    strokeWidth: 2,
  });
  const box = new Konva.Rect({
    x: lineEnd[0],
    y: lineEnd[1],
    width: 310,
    height: 60,
    fill: "#d3d3d3",
    stroke: "black",
    strokeWidth: 2,
  });
  group.add(line);
  group.add(box);
  return group;
}

async function LabelBox(text, rectX, rectY, index, websocket, actorId) {
  const objectId = `labelBox-${index}`;
  const rectangleGroup = new Konva.Group({
    x: rectX,
    y: rectY,
    width: 130,
    height: 25,
    rotation: 0,
    draggable: true,
    id: objectId,
  });

  function onDragMove(e) {
    const pos = e.target.absolutePosition();
    const { x, y } = pos;
    updateCanvas(actorId, objectId, websocket, x, y);
  }
  const { default: _ } = await import("lodash");
  const throttledOnDragMove = _.throttle(onDragMove, 100);

  rectangleGroup.on("dragmove", throttledOnDragMove);
  const box = new Konva.Rect({
    width: 300,
    height: 50,
    fill: "#00D2FF",
    stroke: "black",
    strokeWidth: 2,
  });
  rectangleGroup.add(box);
  const label = new Konva.Text({
    text: text,
    fontSize: 14,
    fontFamily: "Calibri",
    fill: "#000",
    width: 300,
    padding: 5,
    align: "center",
  });
  rectangleGroup.add(label);
  return rectangleGroup;
}

export async function renderGif(frames, layer, stage) {
  if (frames.length === 0) {
    throw new Error("can't play image with no frames");
  }
  let frame = 0;
  while (true) {
    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    layer.canvas.context.drawImage(
      frames[frame].imageData,
      1,
      1,
      400,
      300,
      200,
      200,
      200,
      150
    );
    await new Promise((resolve) =>
      window.setTimeout(resolve, frames[frame].delay)
    );

    if (++frame === frames.length) {
      frame = 0;
    }
  }
}

export async function fetchToBuffer(url) {
  return window.fetch(url).then((response) => response.arrayBuffer());
}

export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function drawImage(imageObj, layer, stage) {
  var image = new Konva.Image({
    image: imageObj,
    x: stage.width() / 2 - 200 / 2,
    y: stage.height() / 2 - 137 / 2,
    width: 200,
    height: 137,
    draggable: true,
  });

  // add cursor styling
  image.on("mouseover", function () {
    document.body.style.cursor = "pointer";
  });
  image.on("mouseout", function () {
    document.body.style.cursor = "default";
  });

  layer.add(image);
  stage.add(layer);
}
