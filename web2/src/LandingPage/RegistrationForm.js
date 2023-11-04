import React, { useState, useEffect } from "react";
import { Formik, Field as _Field, Form as _Form } from "formik";
import styled from "styled-components";
import {
  Box,
  boxy,
  ClearableTextInput,
  TextInput,
  Button,
  Title,
} from "../UtilComponents";
import { P } from "../UtilComponents/Typography/Typography";
import { basicCourseForm } from "./formsData";
import * as Yup from "yup";
import { fontFamily } from "../UtilComponents/sharedStyles";
import ReactGA from "react-ga";

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const ApplicationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Muy corto!")
    .max(50, "Muy largo!")
    .required("Requerido"),
  programmingLevel: Yup.string().required(
    "Favor de seleccionar tu nivel de experiencia con la programación"
  ),
  englishLevel: Yup.string().required(
    "Favor de seleccionar tu nivel de experiencia con el inglés"
  ),
  // whenAttend: Yup.array().required("Favor de seleccionar una opción"),
  whenAttend: Yup.bool().oneOf(
    basicCourseForm.find((field) => field.fieldName === "whenAttend").choices,
    "Por favor elige unas horas"
  ),
  location: Yup.string()
    .min(1, "Muy corto!")
    .required("Favor de decirnos el pais y la ciudad en que resides"),
});

const MultiLabel = styled.label`
  ${boxy}
  font-family: ${fontFamily};
`;
const Field = styled(_Field)`
  ${boxy}
`;
Field.defaultProps = {
  mr: 2,
  mb: 1,
};

const FieldLabel = styled.label`
  ${boxy}
  font-weight: bolder;
  font-family: ${fontFamily};
`;
FieldLabel.defaultProps = {
  mb: 1,
};

const Form = styled(_Form)`
  display: flex;
  flex-direction: column;
`;

const Error = styled(P)`
  color: #ff0033;
`;

const setupFormik = (appStore) => {
  const initialValues = {};
  basicCourseForm.forEach((field) => {
    initialValues[field.fieldName] = field.initialValue
      ? field.initialValue
      : "";
  });
  initialValues["location"] = appStore.userLocation || "";
  initialValues["fullName"] = appStore.lastName
    ? appStore.firstName + " " + appStore.lastName
    : appStore.firstName;
  return { initialValues, basicCourseForm };
};

export const RegistrationForm = ({ cieApi }) => {
  const [appComplete, setAppComplete] = useState(false);
  const [formikData, setFormikData] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const resp = await cieApi.getUserLocation();
        const locationData = resp.data;
        const { city, country_name } = locationData;
      } catch {
        console.log("Unable to get location.");
      }
      setFormikData(_formikData);
    }
    init();
  }, []);

  return (
    <>
      {appComplete ? (
        <P>
          Gracias por completar la solicitud! Te contactaremos dentro de 2 días
          para hablar de los próximos pasos.
        </P>
      ) : (
        <>
          {formikData && (
            <Formik
              validationSchema={ApplicationSchema}
              initialValues={formikData.initialValues}
              onSubmit={async (values, actions) => {
                values.email = appStore.email;
                await cieApi.submitApp(values);
                setAppComplete(true);
                actions.setSubmitting(false);
                appStore.userApplied = true;
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
                  {formikData.basicCourseForm.map((field, idx) => {
                    const { fieldName } = field;
                    let fieldJsx;

                    if (field.fieldType === "shortAnswer") {
                      fieldJsx = (
                        <Box display="flex" flexDirection="column" key={idx}>
                          <FieldLabel htmlFor={field.title} key={idx}>
                            {field.title}
                          </FieldLabel>
                          <TextInput
                            mb={2}
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
                            value={values[field.fieldName] || ""}
                          />
                        </Box>
                      );
                    }
                    if (field.fieldType === "email") {
                      fieldJsx = (
                        <>
                          <FieldLabel htmlFor={field.title} key={idx}>
                            {field.title}
                          </FieldLabel>
                          <TextInput
                            mb={2}
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
                            value={values[fieldName] || ""}
                          />
                        </>
                      );
                    }
                    if (field.fieldType === "multipleChoice") {
                      fieldJsx = (
                        <>
                          <FieldLabel htmlFor={field.title} key={idx}>
                            {field.title}
                          </FieldLabel>
                          <Box display="flex" flexDirection="column" mb={2}>
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
                          </Box>
                        </>
                      );
                    }
                    if (field.fieldType === "checkboxes") {
                      fieldJsx = (
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
                        </>
                      );
                    }
                    if (field.fieldType === "paragraph") {
                      fieldJsx = (
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
                            value={values[fieldName] || ""}
                          />
                        </>
                      );
                    }
                    return (
                      <Box display="flex" flexDirection="column" mb={3}>
                        {fieldJsx}
                        {errors[fieldName] && (
                          <Error>{errors[fieldName]}</Error>
                        )}
                      </Box>
                    );
                  })}
                  <>
                    <FieldLabel htmlFor={"location"}>
                      Ciudad y país. (Lo necesitamos para saber tu zona horaria)
                    </FieldLabel>
                    <ClearableTextInput
                      id={"location"}
                      name={"location"}
                      onFocus={() => {
                        ReactGA.event({
                          category: "applyFieldFocus",
                          action: `user focused field location`,
                        });
                      }}
                      onChange={(e) => {
                        console.log(e);
                        handleChange(e);
                      }}
                      value={values["location"] || appStore.userLocation || ""}
                      onClear={() => {
                        setFieldValue("location", " ", false);
                      }}
                    />

                    {errors["location"] ? (
                      <Error>{errors["location"]}</Error>
                    ) : (
                      <div style={{ color: "white" }}>empty</div>
                    )}
                  </>
                  <Box width="100%" display="flex" flexDirection="column">
                    <Button
                      width={["100%", "45%", "45%", "45%"]}
                      display="flex"
                      alignSelf="center"
                      justifyContent="center"
                      type="submit"
                      onClick={() => {
                        ReactGA.event({
                          category: "appliedCat",
                          action: `userApplied`,
                        });
                      }}
                    >
                      Envía mi solicitud
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          )}
        </>
      )}
    </>
  );
};

export default RegistrationForm;