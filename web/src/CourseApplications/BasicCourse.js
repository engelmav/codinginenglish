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
import { cieApi } from "../services/cieApi";
import EmailForm from "../components/EmailForm";
import settings from "../settings";
import { HappyAlert } from "../components/Alerts";

ReactGA.initialize(settings.gaTrackingId);

const ApplicationSchema = Yup.object().shape({
  "given-name": Yup.string()
    .min(2, "Muy corto!")
    .max(50, "Muy largo!")
    .required("Requerido"),
  "family-name": Yup.string()
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

const setupFormik = () => {
  const initialValues = {};
  basicCourseForm.forEach((field) => {
    initialValues[field.fieldName] = field.initialValue
      ? field.initialValue
      : "";
  });
  initialValues["location"] = "";
  initialValues["fullName"] = "";
  return { initialValues, basicCourseForm };
};

export const BasicCourseForm = ({ cieApi }) => {
  const [appComplete, setAppComplete] = useState(false);
  const [formikData, setFormikData] = useState(false);
  const [capturedEmail, setCapturedEmail] = useState(null);

  const getUserLocation = async () => {
    try {
      const resp = await cieApi.getUserLocation();
      console.log(resp);
      const locationData = resp.data;
      const { city, country_name } = locationData;
      return `${city}, ${country_name}`;
    } catch (e) {
      console.log(e);
      console.log("error getting location data");
    }
  };

  useEffect(() => {
    async function init() {
      const _formikData = setupFormik();
      setFormikData(_formikData);
    }
    init();
  }, []);

  const handleCaptureEmail = (email) => {
    ReactGA.event({
      category: "leadCat",
      action: "clickedStartReg",
      label: "emailCapturedLabel",
    });
    cieApi.createUserEmail({ email: email, status: "startedRegistration" });
    setCapturedEmail(email);
  };
  const handleGoogleSignin = (googleUser) => {
    let profile = googleUser.getBasicProfile();
    console.log("profile:", profile);
    console.log("Token || " + googleUser.getAuthResponse().id_token);
    console.log("ID: " + profile.getId());
    const firstname = profile.getGivenName();
    const lastname = profile.getFamilyName();
    const email = profile.getEmail();
    ReactGA.event({
      category: "leadCat",
      action: "clickedGoogleSignin",
      label: "emailCapturedLabel",
    });
    cieApi.createUserEmail({
      email,
      firstname,
      lastname,
      status: "startedRegistration",
    });
    const newFormikData = Object.assign({}, formikData);
    newFormikData.initialValues["given-name"] = firstname;
    newFormikData.initialValues["family-name"] = lastname;
    setFormikData(newFormikData);
    setCapturedEmail(email);
  };

  return (
    <>
      {!capturedEmail && (
        <>
          <EmailForm
            showGoogleSignin={true}
            blurbAfterEmailField={
              <P fontSize="1" mb="0" mt="1" textAlign="center">
                Después de tu inscripción, te contactaremos para programar una
                reunión.
              </P>
            }
            containerStyles={{
              background: "white",
              width: "100%",
              maxWidth: "600px",
            }}
            submitBtnText="Empieza mi inscripción"
            onFinishSubmitEmail={handleCaptureEmail}
            onGoogleSignin={handleGoogleSignin}
          />
        </>
      )}
      {appComplete ? (
        <HappyAlert p="3">
          <P mb="0">
            ¡Hemos recibido tu inscripción¡ Te contactaremos dentro de 2 días
            programar la reunión.
          </P>
        </HappyAlert>
      ) : (
        <>
          {formikData && capturedEmail && (
            <Formik
              validationSchema={ApplicationSchema}
              initialValues={formikData.initialValues}
              onSubmit={async (values, actions) => {
                values.email = capturedEmail;
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
                            data-cy={fieldName}
                            mb={2}
                            autoComplete={fieldName}
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
                            data-cy={fieldName}
                            autoComplete={true}
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
                                    data-cy={fieldName}
                                    mb={2}
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
                                <Field
                                  data-cy={fieldName}
                                  mb={2}
                                  type="checkbox"
                                  name={choice}
                                />
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
                            data-cy={fieldName}
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
                      data-cy="location"
                      button={
                        <Button
                          onClick={async () => {
                            const loc = await getUserLocation();
                            setFieldValue("location", loc);
                          }}
                          bg="black"
                          p="1px"
                        >
                          Find me
                        </Button>
                      }
                      id="location"
                      name="location"
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
                      value={values["location"]}
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
                          action: `userClickedRegister`,
                          label: "appliedLabel",
                        });
                      }}
                    >
                      ¡Inscríbeme!
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
