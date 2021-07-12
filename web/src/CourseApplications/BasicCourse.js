import React, { useState } from "react";
import { Formik, Field, Form as _Form } from "formik";
import styled from "styled-components";
import {
  TextInput,
  Button,
  Main,
  Title,
} from "../UtilComponents";
import { P, TitleH2 } from "../UtilComponents/Typography/Typography";
import { basicCourseForm } from "./formsData";
import * as Yup from "yup";
import {
  fontFamily,
  cieOrange,
} from "../UtilComponents/sharedStyles";
import { FaCheckCircle } from "@react-icons/all-files/fa/FaCheckCircle";
import ReactGA from "react-ga";

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const ApplicationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Muy corto!")
    .max(50, "Muy largo!")
    .required("Requerido"),
  email: Yup.string().email("Invalid email").required("Requerido"),
  programmingLevel: Yup.string().required(
    "Favor de seleccionar tu nivel de experiencia con la programacion"
  ),
  englishLevel: Yup.string().required(
    "Favor de seleccionar tu nivel de experiencia con el ingles"
  ),
  // whenAttend: Yup.array().required("Favor de seleccionar una opcion"),
  whenAttend: Yup.bool().oneOf(
    basicCourseForm.find((field) => field.fieldName === "whenAttend").choices,
    "Por favor elige unas horas"
  ),
  location: Yup.string()
    .min(1, "Muy corto!")
    .required("Favor de decirnos el pais y la ciudad en que resides"),
});

const MultiLabel = styled.label`
  font-family: ${fontFamily};
`;

const FieldLabel = styled.label`
  font-weight: bolder;
  font-family: ${fontFamily};
`;

const Form = styled(_Form)`
  display: flex;
  flex-direction: column;
`;

const Error = styled.div`
  color: #ff0033;
`;

const MainAppl = styled(Main)`
  width: min(90%, 700px);
`;

const ClearableTextField = styled(TextInput)`
  position: relative;
  &:not(:valid) ~ .close-icon {
    display: none;
  }
`;

const ClearFieldButton = styled.button`
  border: 1px solid transparent;
  background-color: transparent;
  display: inline-block;
  vertical-align: middle;
  outline: 0;
  cursor: pointer;
  position: relative;
  padding: 10px;
  &:after {
    content: "X";
    display: block;
    width: 15px;
    height: 15px;
    position: absolute;
    background-color: ${cieOrange};
    z-index: 1;
    right: 10px;
    top: -74px;
    bottom: 0;
    margin: auto;
    padding: 2px;
    border-radius: 50%;
    text-align: center;
    color: white;
    font-weight: normal;
    font-size: 12px;
    box-shadow: 0 0 2px #e50f0f;
    cursor: pointer;
  }
`;

export const BasicCourseForm = ({ appStore, cieApi }) => {
  const [appComplete, setAppComplete] = useState(false);
  const initialValues = {};
  basicCourseForm.forEach((field) => {
    initialValues[field.fieldName] = field.initialValue
      ? field.initialValue
      : "";
  });
  initialValues["location"] = appStore.userLocation || "";

  return (
    <MainAppl p={20}>
      <Title textAlign="center">Webapp Development - Basic</Title>
      <P textAlign="center">
        <i>del 20 septiembre al 20 diciembre</i>
      </P>
      {appComplete ? (
        <p>
          Gracias por completar la solicitud! Te contactaremos dentro de 2 días
          para hablar de los próximos pasos.
        </p>
      ) : (
        <>

          <Formik
            validationSchema={ApplicationSchema}
            initialValues={initialValues}
            onSubmit={async (values, actions) => {
              await cieApi.submitApp(values);
              setAppComplete(true);
              actions.setSubmitting(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleSubmit,
              handleChange,
              handleBlur,
              isSubmitting,
              setFieldValue,
            }) => (
              <Form onSubmit={handleSubmit}>
                {basicCourseForm.map((field, idx) => {
                  const { fieldName } = field;
                  if (field.fieldType === "shortAnswer") {
                    return (
                      <>
                        <FieldLabel htmlFor={field.title} key={idx}>
                          {field.title}
                        </FieldLabel>
                        <TextInput
                          autocomplete="false"
                          type="text"
                          id={fieldName}
                          name={fieldName}
                          onFocus={() => {
                            ReactGA.event({
                              category: "applyFieldFocus",
                              action: `user focused field ${field.title}`,
                            });
                          }}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          value={values[field.fieldName]}
                        />
                        {errors[fieldName] ? (
                          <Error>{errors[fieldName]}</Error>
                        ) : (
                          <div style={{ color: "white" }}>empty</div>
                        )}
                      </>
                    );
                  }
                  if (field.fieldType === "email") {
                    return (
                      <>
                        <FieldLabel htmlFor={field.title} key={idx}>
                          {field.title}
                        </FieldLabel>
                        <TextInput
                          type="email"
                          id={fieldName}
                          name={fieldName}
                          onFocus={() => {
                            ReactGA.event({
                              category: "applyFieldFocus",
                              action: `user focused field ${field.title}`,
                            });
                          }}
                          onChange={handleChange}
                          value={values[fieldName]}
                        />
                        {errors[fieldName] ? (
                          <Error>{errors[fieldName]}</Error>
                        ) : (
                          <div style={{ color: "white" }}>empty</div>
                        )}
                      </>
                    );
                  }
                  if (field.fieldType === "multipleChoice") {
                    return (
                      <>
                        <FieldLabel htmlFor={field.title} key={idx}>
                          {field.title}
                        </FieldLabel>
                        {field.choices.map((choice, idx) => {
                          return (
                            <MultiLabel key={idx}>
                              <Field
                                type="radio"
                                name={fieldName}
                                value={choice}
                              />
                              {choice}
                            </MultiLabel>
                          );
                        })}
                        {errors[fieldName] ? (
                          <Error>{errors[fieldName]}</Error>
                        ) : (
                          <div style={{ color: "white" }}>empty</div>
                        )}
                      </>
                    );
                  }
                  if (field.fieldType === "checkboxes") {
                    return (
                      <>
                        <FieldLabel htmlFor={field.title}>
                          {field.title}
                        </FieldLabel>
                        {field.choices.map((choice, idx) => {
                          return (
                            <MultiLabel key={idx}>
                              <Field type="checkbox" name={choice} />
                              {choice}
                            </MultiLabel>
                          );
                        })}
                        {errors[fieldName] ? (
                          <Error>{errors[fieldName]}</Error>
                        ) : (
                          <div style={{ color: "white" }}>empty</div>
                        )}
                      </>
                    );
                  }
                  if (field.fieldType === "paragraph") {
                    return (
                      <>
                        <FieldLabel htmlFor={field.title} key={idx}>
                          {field.title}
                        </FieldLabel>
                        <TextInput
                          as="textarea"
                          name={fieldName}
                          value={values[field.fieldName]}
                          onFocus={() => {
                            ReactGA.event({
                              category: "applyFieldFocus",
                              action: `user focused field ${field.title}`,
                            });
                          }}
                          onChange={handleChange}
                          value={values[fieldName]}
                        />
                        {errors[fieldName] ? (
                          <Error>{errors[fieldName]}</Error>
                        ) : (
                          <div style={{ color: "white" }}>empty</div>
                        )}
                      </>
                    );
                  }
                })}
                <>
                  <FieldLabel htmlFor={"location"}>
                    Ciudad y país. (Lo necesitamos para saber tu zona horaria)
                  </FieldLabel>

                  <TextInput
                    type="search"
                    id={"location"}
                    name={"location"}
                    onFocus={() => {
                      ReactGA.event({
                        category: "applyFieldFocus",
                        action: `user focused field location`,
                      });
                    }}
                    onChange={handleChange}
                    value={values["location"] || appStore.userLocation}
                  />
                  <ClearFieldButton
                    onClick={() => setFieldValue("location", " ", false)}
                  ></ClearFieldButton>

                  {errors["location"] ? (
                    <Error>{errors["location"]}</Error>
                  ) : (
                    <div style={{ color: "white" }}>empty</div>
                  )}
                </>
                <Button
                  type="submit"
                  onClick={() =>
                    ReactGA.event({
                      category: "appliedCat",
                      action: `userApplied`,
                    })
                  }
                ><FaCheckCircle />
                  Envía mi solicitud
                </Button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </MainAppl>
  );
};
