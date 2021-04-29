/**
 * OMG. This thing needs to synch with websockets. OMG.
 */

/**
 *
 * Will need to take some sort of websockets service subscribed to its topic.
 * It's topic will hjave to be the activeSessionId + the activity id. (activity Id?!?)
 */

import React, { useEffect, useRef } from "react";
import Konva from "konva";
import * as fastgif from "../../node_modules/fastgif/fastgif.js";
import { Stage, Layer, Image } from "react-konva";
fastgif.setDebug();

const Gif = ({ src }) => {
  const imageRef = useRef(null);
};

export const DragToImageCollab = ({ settings }) => {
  /**
   * this thing will have to have some sort of assetId or activityId.
   * when queried from the backend, it'll return the "definition" of the
   * activity. e.g. images: [{imageUrl: url, pos: {x: xval, y: yval}}]
   */
  const canvasSpec = {
    images: [
      {
        imageSource: "/activities/dragToImage/basic-01-horse.gif",
        pos: { x: 3, y: 49 },
      },
    ],
  };
  const canvasRef = useRef(null);
  useEffect(() => {
    async function init(){
      await drawCanvas(canvasSpec, canvasRef, settings)
    }
    init();
  });
  return (
    <div id="drag-to-image-collab">
      <canvas ref={canvasRef}></canvas>
      <Stage>
        <Layer>
          <Image></Image>
        </Layer>
      </Stage>
    </div>
  );
};

function drawImage(imageObj, layer, stage) {
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

async function renderGif(all, layer) {
  if (all.length === 0) {
    throw new Error("can't play image with no frames");
  }
  let frame = 0;
  layer.canvas.scaleX = 900; //all[0].imageData.width;
  layer.canvas.scaleY = 900; //all[0].imageData.height;
  while (true) {

    layer.canvas.context.putImageData(all[frame].imageData, 0, 0);
    await new Promise((resolve) =>
      window.setTimeout(resolve, all[frame].delay)
    );

    if (++frame === all.length) {
      frame = 0;
    }
  }
}

async function fetchToBuffer(url) {
  return window.fetch(url).then((response) => response.arrayBuffer());
}

async function drawCanvas(canvasSpec, canvasRef, settings) {
  var stage = new Konva.Stage({
    width: 500,
    height: 800,
    container: '#drag-to-image-collab'
  });
  const canvas = canvasRef.current;
  var layer = new Konva.Layer({
    draggable: true
  });
  stage.add(layer);

  canvasSpec.images.forEach(async (image) => {
    if (!window.WebAssembly) {
      globalErr("Your browser doesn't have WebAssembly!");
    }
    const buf = await fetchToBuffer(`${settings.assets}${image.imageSource}`);
    const wasmDecoder = new fastgif.Decoder();
    renderGif(await wasmDecoder.decode(buf), layer);
  });

  // var rectX = stage.width() / 2 - 50;
  // var rectY = stage.height() / 2 - 25;

  // var box = new Konva.Rect({
  //   x: rectX,
  //   y: rectY,
  //   width: 100,
  //   height: 50,
  //   fill: "#00D2FF",
  //   stroke: "black",
  //   strokeWidth: 4,
  //   draggable: true,
  // });

  // // add cursor styling
  // box.on("mouseover", function () {
  //   document.body.style.cursor = "pointer";
  // });
  // box.on("mouseout", function () {
  //   document.body.style.cursor = "default";
  // });

  // layer.add(box);
  // stage.add(layer);
}

// var c = document.getElementById("canv");
// var $ = c.getContext("2d");
// c.width = window.innerWidth;
// c.height = window.innerHeight;
// var imgURL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/131045/colorful-triangles.jpg';

// loadImage(imgURL);

// window.addEventListener('paste', function(e){
// 	if(e.clipboardData == false) return false;
//   var imgs = e.clipboardData.items;
//   if(imgs == undefined) return false;
//     for (var i = 0; i < imgs.length; i++) {
//         if (imgs[i].type.indexOf("image") == -1) continue;
//           var imgObj = imgs[i].getAsFile();
//           var url = window.URL || window.webkitURL;
//           var src = url.createObjectURL(imgObj);
//           $.clearRect(0,0,c.width,c.height);
//           loadImage(src);
//         }
// 	  });

// function loadImage(src){
//   var img = new Image();
//   img.onload = function(e) {
//     $.drawImage(img,0,0);
//   };
//   img.src = src;
// }

// const src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/208665/large.gif';

// async function render(all, stat, label) {
//   const canvas = document.createElement('canvas');
//   if (all.length === 0) {
//     throw new Error('can\'t play image with no frames');
//   }
//   canvas.width = all[0].imageData.width;
//   canvas.height = all[0].imageData.height;

//   holder.appendChild(heading);
//   holder.appendChild(canvas);
//   out.appendChild(holder);

//   const ctx = canvas.getContext('2d');

//   let frame = 0;
//   while (true) {
//     ctx.putImageData(all[frame].imageData, 0, 0);
//     await new Promise((resolve) => window.setTimeout(resolve, all[frame].delay));

//     if (++frame === all.length) {
//       frame = 0;
//     }
//   }
// }

// rerun.href += "?" + Math.random();
