import React, { useRef } from "react";
class PostProcess {
    constructor(data){
      this.data = data;
      this.applyProperties = this.applyProperties.bind(this);
    }
    applyProperties(o, object){
      if (object.id === this.data.id){
        object.set(data.settings);
      }
    }
}


export const Collab = ({
  appStore,
  jsonModel,
  settings,
  websocket,
  activeSessionId,
  createWebsocket,
}) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    async function init() {
      const pp = new PostProcess(settingsData);
      const canvas = new fabric.fabric.Canvas(canvasRef);
      canvas.loadFromJSON(jsonModel, canvas.renderAll.bind(canvas), pp.applyProperties);
      // await drawCanvas(model, settings, websocket, appStore.userId);
    }
    init();
  }, []);
  return <S.canvas ref={canvasRef} id="canvas" />;
};
