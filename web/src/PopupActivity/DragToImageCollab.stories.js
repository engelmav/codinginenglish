import React from "react";
import  { DragToImageCollab as _DragToImageCollab } from "./DragToImageCollab";

export default {
  title: "PopUpActivities/DragToImageCollab",
  component: DragToImageCollab,
};

let props = {
  settings: {
    assets: "https://cie-assets.nyc3.digitaloceanspaces.com",
  },
};


export const DragToImageCollab = () => (
    <_DragToImageCollab {...props}/>
);
