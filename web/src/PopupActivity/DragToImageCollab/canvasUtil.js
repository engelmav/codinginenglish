import Konva from "konva";
import * as fastgif from "../../../node_modules/fastgif/fastgif.js";

export async function drawCanvas(canvasSpec, settings, websocket) {
  const stage = new Konva.Stage({
    width: 800,
    height: 800,
    container: "#drag-to-image-collab",
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
    renderGif(await wasmDecoder.decode(buf), gifLayer);
  });

  var rectX = stage.width() / 2 - 50;
  var rectY = stage.height() / 2 - 25;

  const labelBox = LabelBox("a phrase", rectX, rectY, websocket);

  layer.add(labelBox);
  stage.add(layer);
}

export function LabelBox(text, rectX, rectY, websocket) {
  console.log("LabelBox using websocket object", websocket);
  const rectangleGroup = new Konva.Group({
    x: rectX,
    y: rectY,
    width: 130,
    height: 25,
    rotation: 0,
    draggable: true,
  });
  rectangleGroup.on('dragmove', function (e) {
    console.log("clientX, clientY", e.evt.clientX, e.evt.clientY);
    websocket.send(e.evt.clientX);
  });
  const box = new Konva.Rect({
    width: 100,
    height: 50,
    fill: "#00D2FF",
    stroke: "black",
    strokeWidth: 4,
  });
  rectangleGroup.add(box);
  const label = new Konva.Text({
    text: text,
    fontSize: 18,
    fontFamily: "Calibri",
    fill: "#000",
    width: 130,
    padding: 5,
    align: "center",
  });
  rectangleGroup.add(label);
  return rectangleGroup;
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

export async function renderGif(all, layer) {
  if (all.length === 0) {
    throw new Error("can't play image with no frames");
  }
  let frame = 0;
  while (true) {
    layer.canvas.context.putImageData(
      all[frame].imageData,
      150,
      0,
      50,
      50,
      25,
      25
    );
    await new Promise((resolve) =>
      window.setTimeout(resolve, all[frame].delay)
    );

    if (++frame === all.length) {
      frame = 0;
    }
  }
}

export async function fetchToBuffer(url) {
  return window.fetch(url).then((response) => response.arrayBuffer());
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
