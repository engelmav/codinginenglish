import React from "react";
import { BasicCourseForm } from "./BasicCourse";
import { Router } from "react-router";
import { cieOrange } from "../UtilComponents/sharedStyles";

export default {
  title: "Forms/BasicCourse",
  component: BasicCourseForm,
};

class FakeAssApi {
  submitApp(appData){
    alert(appData);
  }
}

const fakeCieApi = new FakeAssApi();

const props = {
  cieApi: fakeCieApi,
  settings: {
    assets: "https://cie-assets.nyc3.digitaloceanspaces.com",
  },
}

export const DefaultView = () => (

    <BasicCourseForm {...props} />
);
