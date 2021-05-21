import React from "react";
import { Collab as _Collab } from "./Collab";
import { makeAppStore } from "../../stores/AppStore";

export default {
  title: "PopUpActivities/Collab",
  component: Collab,
};

const settings = {
  settings: {
    assets: "https://cie-assets.nyc3.digitaloceanspaces.com",
    websocketAddress: "ws://127.0.0.1:5000/ws/stream",
  },
};

class FakeWebsocket {
  send(data) {
    console.log(data);
  }

  addEventListener = () => {};
}
const websocket = new FakeWebsocket();
const model = {
  canvasData: {
    version: "4.4.0",
    objects: [
      {
        type: "path",
        version: "4.4.0",
        originX: "left",
        originY: "top",
        left: 242.06,
        top: 67.77,
        width: 361.1,
        height: 77.74,
        fill: null,
        stroke: "rgb(0, 0, 0)",
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: "round",
        strokeDashOffset: 0,
        strokeLineJoin: "round",
        strokeUniform: false,
        strokeMiterLimit: 10,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        flipX: false,
        flipY: false,
        opacity: 1,
        shadow: null,
        visible: true,
        backgroundColor: "",
        fillRule: "nonzero",
        paintFirst: "fill",
        globalCompositeOperation: "source-over",
        skewX: 0,
        skewY: 0,
        id: "vZ4twnT4yYx4EAjpAj2Xc",
        path: [
          ["M", 242.56446134663344, 70.265780730897],
          [
            "Q",
            242.56546134663344,
            70.265780730897,
            244.06172069825436,
            70.265780730897,
          ],
          [
            "Q",
            245.5579800498753,
            70.265780730897,
            249.54800498753116,
            70.265780730897,
          ],
          [
            "Q",
            253.53802992518703,
            70.265780730897,
            260.5205735660848,
            70.265780730897,
          ],
          [
            "Q",
            267.50311720698255,
            70.265780730897,
            278.97443890274315,
            70.265780730897,
          ],
          [
            "Q",
            290.44576059850374,
            70.265780730897,
            302.91458852867834,
            70.265780730897,
          ],
          [
            "Q",
            315.3834164588529,
            70.265780730897,
            327.8522443890274,
            70.265780730897,
          ],
          [
            "Q",
            340.321072319202,
            70.265780730897,
            352.2911471321696,
            70.265780730897,
          ],
          [
            "Q",
            364.26122194513715,
            70.265780730897,
            377.7275561097257,
            70.265780730897,
          ],
          [
            "Q",
            391.19389027431424,
            70.265780730897,
            403.6627182044888,
            70.265780730897,
          ],
          [
            "Q",
            416.1315461346634,
            70.265780730897,
            426.60536159600997,
            70.265780730897,
          ],
          [
            "Q",
            437.0791770573566,
            70.265780730897,
            449.54800498753116,
            70.265780730897,
          ],
          [
            "Q",
            462.01683291770576,
            70.265780730897,
            469.99688279301745,
            70.265780730897,
          ],
          [
            "Q",
            477.9769326683292,
            70.265780730897,
            483.463216957606,
            70.265780730897,
          ],
          [
            "Q",
            488.9495012468828,
            70.265780730897,
            492.93952618453864,
            70.265780730897,
          ],
          [
            "Q",
            496.92955112219454,
            70.265780730897,
            504.90960099750623,
            69.76744186046511,
          ],
          [
            "Q",
            512.8896508728179,
            69.26910299003322,
            513.8871571072319,
            68.77076411960132,
          ],
          [
            "Q",
            514.8846633416459,
            68.27242524916943,
            515.8821695760598,
            68.27242524916943,
          ],
          [
            "Q",
            516.8796758104738,
            68.27242524916943,
            517.8771820448878,
            68.27242524916943,
          ],
          [
            "Q",
            518.8746882793017,
            68.27242524916943,
            519.3734413965087,
            68.27242524916943,
          ],
          [
            "Q",
            519.8721945137157,
            68.27242524916943,
            521.3684538653367,
            68.27242524916943,
          ],
          [
            "Q",
            522.8647132169576,
            68.27242524916943,
            523.3634663341646,
            68.27242524916943,
          ],
          [
            "Q",
            523.8622194513716,
            68.27242524916943,
            524.3609725685785,
            68.27242524916943,
          ],
          [
            "Q",
            524.8597256857855,
            68.27242524916943,
            525.3584788029925,
            68.27242524916943,
          ],
          [
            "Q",
            525.8572319201995,
            68.27242524916943,
            526.3559850374065,
            68.27242524916943,
          ],
          [
            "Q",
            526.8547381546135,
            68.27242524916943,
            527.3534912718205,
            68.27242524916943,
          ],
          [
            "Q",
            527.8522443890274,
            68.27242524916943,
            528.3509975062344,
            68.27242524916943,
          ],
          [
            "Q",
            528.8497506234414,
            68.27242524916943,
            529.3485037406484,
            69.76744186046511,
          ],
          [
            "Q",
            529.8472568578554,
            71.2624584717608,
            529.8472568578554,
            72.25913621262458,
          ],
          [
            "Q",
            529.8472568578554,
            73.25581395348837,
            530.8447630922694,
            74.75083056478405,
          ],
          [
            "Q",
            531.8422693266833,
            76.24584717607974,
            532.3410224438903,
            78.23920265780731,
          ],
          [
            "Q",
            532.8397755610973,
            80.23255813953489,
            532.8397755610973,
            81.22923588039868,
          ],
          [
            "Q",
            532.8397755610973,
            82.22591362126245,
            532.8397755610973,
            82.72425249169434,
          ],
          [
            "Q",
            532.8397755610973,
            83.22259136212624,
            532.8397755610973,
            84.71760797342192,
          ],
          [
            "Q",
            532.8397755610973,
            86.2126245847176,
            533.3385286783043,
            86.7109634551495,
          ],
          [
            "Q",
            533.8372817955112,
            87.20930232558139,
            533.8372817955112,
            87.70764119601328,
          ],
          [
            "Q",
            533.8372817955112,
            88.20598006644518,
            534.3360349127182,
            89.20265780730897,
          ],
          [
            "Q",
            534.8347880299252,
            90.19933554817275,
            534.8347880299252,
            91.19601328903654,
          ],
          [
            "Q",
            534.8347880299252,
            92.19269102990033,
            534.8347880299252,
            93.18936877076412,
          ],
          [
            "Q",
            534.8347880299252,
            94.18604651162791,
            534.8347880299252,
            94.6843853820598,
          ],
          [
            "Q",
            534.8347880299252,
            95.1827242524917,
            535.3335411471322,
            95.68106312292359,
          ],
          [
            "Q",
            535.8322942643392,
            96.17940199335548,
            536.3310473815461,
            97.67441860465117,
          ],
          [
            "Q",
            536.8298004987531,
            99.16943521594685,
            537.3285536159601,
            99.66777408637874,
          ],
          [
            "Q",
            537.8273067331671,
            100.16611295681064,
            537.8273067331671,
            100.66445182724252,
          ],
          [
            "Q",
            537.8273067331671,
            101.16279069767441,
            538.3260598503741,
            101.6611295681063,
          ],
          [
            "Q",
            538.8248129675811,
            102.1594684385382,
            538.8248129675811,
            103.15614617940199,
          ],
          [
            "Q",
            538.8248129675811,
            104.15282392026577,
            539.822319201995,
            105.14950166112956,
          ],
          [
            "Q",
            540.819825436409,
            106.14617940199335,
            540.819825436409,
            106.64451827242524,
          ],
          [
            "Q",
            540.819825436409,
            107.14285714285714,
            540.819825436409,
            107.64119601328903,
          ],
          [
            "Q",
            540.819825436409,
            108.13953488372093,
            541.318578553616,
            109.63455149501661,
          ],
          [
            "Q",
            541.817331670823,
            111.12956810631229,
            543.3135910224439,
            113.62126245847176,
          ],
          [
            "Q",
            544.8098503740648,
            116.11295681063123,
            544.8098503740648,
            117.10963455149502,
          ],
          [
            "Q",
            544.8098503740648,
            118.10631229235881,
            545.3086034912718,
            119.1029900332226,
          ],
          [
            "Q",
            545.8073566084788,
            120.09966777408637,
            547.3036159600997,
            122.59136212624584,
          ],
          [
            "Q",
            548.7998753117207,
            125.08305647840531,
            549.2986284289277,
            126.57807308970098,
          ],
          [
            "Q",
            549.7973815461347,
            128.07308970099666,
            549.7973815461347,
            129.56810631229234,
          ],
          [
            "Q",
            549.7973815461347,
            131.06312292358803,
            550.7948877805486,
            131.56146179401992,
          ],
          [
            "Q",
            551.7923940149626,
            132.0598006644518,
            552.2911471321696,
            133.5548172757475,
          ],
          [
            "Q",
            552.7899002493766,
            135.04983388704318,
            552.7899002493766,
            136.54485049833886,
          ],
          [
            "Q",
            552.7899002493766,
            138.03986710963454,
            553.2886533665835,
            139.03654485049833,
          ],
          [
            "Q",
            553.7874064837905,
            140.03322259136212,
            554.2861596009975,
            141.0299003322259,
          ],
          [
            "Q",
            554.7849127182045,
            142.0265780730897,
            555.2836658354115,
            142.0265780730897,
          ],
          [
            "Q",
            555.7824189526185,
            142.0265780730897,
            556.2811720698255,
            143.02325581395348,
          ],
          [
            "Q",
            556.7799251870324,
            144.01993355481727,
            556.7799251870324,
            144.51827242524917,
          ],
          [
            "Q",
            556.7799251870324,
            145.01661129568106,
            557.2786783042394,
            145.51495016611295,
          ],
          [
            "Q",
            557.7774314214464,
            146.01328903654485,
            558.7749376558604,
            146.01328903654485,
          ],
          [
            "Q",
            559.7724438902743,
            146.01328903654485,
            562.7649625935162,
            145.01661129568106,
          ],
          [
            "Q",
            565.7574812967581,
            144.01993355481727,
            568.2512468827931,
            143.02325581395348,
          ],
          [
            "Q",
            570.745012468828,
            142.0265780730897,
            573.2387780548629,
            141.5282392026578,
          ],
          [
            "Q",
            575.7325436408978,
            141.0299003322259,
            578.2263092269327,
            139.53488372093022,
          ],
          [
            "Q",
            580.7200748129676,
            138.03986710963454,
            583.7125935162095,
            137.04318936877075,
          ],
          [
            "Q",
            586.7051122194514,
            136.04651162790697,
            589.6976309226933,
            134.55149501661128,
          ],
          [
            "Q",
            592.6901496259352,
            133.0564784053156,
            594.1864089775561,
            132.5581395348837,
          ],
          [
            "Q",
            595.6826683291771,
            132.0598006644518,
            597.1789276807981,
            131.56146179401992,
          ],
          [
            "Q",
            598.675187032419,
            131.06312292358803,
            600.1714463840399,
            130.06644518272424,
          ],
          [
            "Q",
            601.6677057356609,
            129.06976744186045,
            602.1664588528679,
            129.06976744186045,
          ],
          [
            "Q",
            602.6652119700749,
            129.06976744186045,
            603.1639650872819,
            128.57142857142856,
          ],
          ["L", 603.6637182044888, 128.07208970099666],
        ],
      },
      {
        type: "i-text",
        version: "4.4.0",
        originX: "left",
        originY: "top",
        left: 100,
        top: 100,
        width: 34.63,
        height: 18.08,
        fill: "black",
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: "butt",
        strokeDashOffset: 0,
        strokeLineJoin: "miter",
        strokeUniform: false,
        strokeMiterLimit: 4,
        scaleX: 2.5,
        scaleY: 2.5,
        angle: 0,
        flipX: false,
        flipY: false,
        opacity: 1,
        shadow: null,
        visible: true,
        backgroundColor: "",
        fillRule: "nonzero",
        paintFirst: "fill",
        globalCompositeOperation: "source-over",
        skewX: 0,
        skewY: 0,
        text: "cagar",
        fontSize: 16,
        fontWeight: "normal",
        fontFamily: "arial black",
        fontStyle: "normal",
        lineHeight: 1.16,
        underline: false,
        overline: false,
        linethrough: false,
        textAlign: "left",
        textBackgroundColor: "",
        charSpacing: 0,
        path: null,
        id: "I2QpGrP1Hi5y5JQqCmZ6U",
        styles: {},
      },
      {
        type: "circle",
        version: "4.4.0",
        originX: "left",
        originY: "top",
        left: 523.94,
        top: 221.59,
        width: 100,
        height: 100,
        fill: "black",
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: "butt",
        strokeDashOffset: 0,
        strokeLineJoin: "miter",
        strokeUniform: false,
        strokeMiterLimit: 4,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        flipX: false,
        flipY: false,
        opacity: 1,
        shadow: null,
        visible: true,
        backgroundColor: "",
        fillRule: "nonzero",
        paintFirst: "fill",
        globalCompositeOperation: "source-over",
        skewX: 0,
        skewY: 0,
        radius: 50,
        startAngle: 0,
        endAngle: 6.283185307179586,
        id: "yXTOcclC1Z7EwQulhCkaj",
      },
      {
        type: "rect",
        version: "4.4.0",
        originX: "left",
        originY: "top",
        left: 111.97,
        top: 228.57,
        width: 50,
        height: 50,
        fill: "rgb(0,0,0)",
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: "butt",
        strokeDashOffset: 0,
        strokeLineJoin: "miter",
        strokeUniform: false,
        strokeMiterLimit: 4,
        scaleX: 4.79,
        scaleY: 1,
        angle: 0,
        flipX: false,
        flipY: false,
        opacity: 1,
        shadow: null,
        visible: true,
        backgroundColor: "",
        fillRule: "nonzero",
        paintFirst: "fill",
        globalCompositeOperation: "source-over",
        skewX: 0,
        skewY: 0,
        rx: 0,
        ry: 0,
        id: "QLgtliCZXGsHl40DLqdbL",
      },
      {
        type: "image",
        version: "4.4.0",
        originX: "left",
        originY: "top",
        left: 279.5,
        top: 167.9,
        width: 768,
        height: 576,
        fill: "rgb(0,0,0)",
        stroke: null,
        strokeWidth: 0,
        strokeDashArray: null,
        strokeLineCap: "butt",
        strokeDashOffset: 0,
        strokeLineJoin: "miter",
        strokeUniform: false,
        strokeMiterLimit: 4,
        scaleX: 0.36,
        scaleY: 0.36,
        angle: 0,
        flipX: false,
        flipY: false,
        opacity: 1,
        shadow: null,
        visible: true,
        backgroundColor: "",
        fillRule: "nonzero",
        paintFirst: "fill",
        globalCompositeOperation: "source-over",
        skewX: 0,
        skewY: 0,
        cropX: 0,
        cropY: 0,
        id: "C9LrbK7tuILNMfcPJ1wpt",
        src:
          "https://www.researchgate.net/profile/Artabandhu-Sahoo/publication/324801534/figure/fig2/AS:875464692350984@1585738456753/Packing-of-fodder-in-plastic-bag-for-silage-making.ppm",
        crossOrigin: null,
        filters: [],
      },
    ],
  },
  exerciseTitle: "dfd",
  exerciseObjectProperties: {
    C9LrbK7tuILNMfcPJ1wpt: {
      _id: "C9LrbK7tuILNMfcPJ1wpt",
      lockMovementX: true,
      lockMovementY: true,
    },
  },
  studentDrawOptions: {
    addImages: true,
    addShapes: true,
    addText: true,
    freeDraw: true,
  },
};

const appStore = makeAppStore("collab");
appStore.userId = "someUserId";

console.log("Collab.stories appStore.userId", appStore.userId);

let props = {
  appStore,
  model,
  ...settings,
  websocket,
};
let props2 = {
  ...props,
  editorMode: true
}

export const Collab = () => <_Collab {...props} />;
export const CollabEditor = () => (

    <_Collab {...props2} />

);

