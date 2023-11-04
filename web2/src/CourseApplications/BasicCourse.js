import React, { useState, useEffect } from "react";
import { Formik, Field as _Field, Form as _Form } from "formik";
import styled from "styled-components";
import {
  Box,
  boxy,
  ClearableTextInput,
  TextInput,
  Button,
} from "../UtilComponents";
import { P } from "../UtilComponents/Typography/Typography";
import { basicCourseForm } from "./formsData";
import * as Yup from "yup";
import ReactGA from "react-ga";
import { cieApi } from "../services/cieApi";
import EmailForm from "../components/EmailForm";
import settings from "../settings";
import { HappyAlert } from "../components/Alerts";

ReactGA.initialize(settings.gaTrackingId);

const ApplicationSchema = Yup.object().shape({
  email: Yup.string().email(),
  startDate: Yup.string().required("Por favor elige una fecha de inicio."),
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

const BasicCourseContainer = styled.div`
  ${boxy}
`;

const Field = styled(_Field)`
  ${boxy}
`;

const MultiLabel = styled.label`
  ${boxy}
  font-family: Lato;
  font-size: 0.8em;
  display: flex;
  align-items: center;
  ${({ disabled }) => (disabled ? "text-decoration: line-through" : "")};
  input {
    height: 1.3em;
    width: 1.3em;
    margin-top: 0.65em;
  }
  input[type="checkbox"] {
    border-radius: 20%;
    border: 1px solid rgba(0, 0, 0, 0.25);
    border-color: #4285f4;
    appearance: none;
  }
  input[type="radio"] {
    border: 1px solid rgba(0, 0, 0, 0.25);
    appearance: none;
    border-radius: 50%;
    border-color: #4285f4;
  }
  input[type="radio"]:checked {
    background: radial-gradient(
      #4285f4 0%,
      #4285f4 40%,
      transparent 50%,
      transparent
    );
  }
  input[type="checkbox"]:checked {
    background: radial-gradient(
      #4285f4 0%,
      #4285f4 40%,
      transparent 50%,
      transparent
    );
  }
`;

MultiLabel.defaultProps = {
  mb: 2,
};
Field.defaultProps = {
  ml: 2,
  mr: 2,
  mb: 1,
};

const FieldLabel = styled.label`
  ${boxy}
  font-weight: bolder;
  font-family: Lato;
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
  initialValues["startDate"] = "";
  return { initialValues, basicCourseForm };
};

const Note = styled.span`
  color: gray;
  font-size: 0.8em;
  font-weight: 700;
  padding-left: 5px;
`;


export const BasicCourseForm = ({
  containerStyles,
  dividerStyles,
  completedText,
}) => {
  const [appComplete, setAppComplete] = useState(false);
  const [formikData, setFormikData] = useState(false);
  const [origEmail, setOrigEmail] = useState(null);

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
      category: "registration",
      action: "clickedStartReg",
      label: "reg email capture",
    });
    cieApi.createUserEmail({ email: email, status: "startedRegistration" });
    setOrigEmail(email);
    const newFormikData = Object.assign({}, formikData);
    newFormikData.initialValues["email"] = email;
    setFormikData(newFormikData);
  };
  const handleGoogleSignin = (googleUser) => {
    let profile = googleUser.getBasicProfile();
    const firstname = profile.getGivenName();
    const lastname = profile.getFamilyName();
    const email = profile.getEmail();
    ReactGA.event({
      category: "registration",
      action: "clickedGoogleSignin",
      label: "emailCapturedLabel",
    });
    createAndUpdateUserData(firstname, lastname, email);
  };

  const handleFacebookSignin = (fbAuthResp) => {
    const { first_name, last_name, email } = fbAuthResp;
    ReactGA.event({
      category: "registration",
      action: "clicked fb signin",
      label: "email captured",
    });
    createAndUpdateUserData(first_name, last_name, email);
  };

  const createAndUpdateUserData = (firstname, lastname, email) => {
    cieApi.createUserEmail({
      email,
      firstname,
      lastname,
      status: "startedRegistration",
    });
    const newFormikData = Object.assign({}, formikData);
    newFormikData.initialValues["given-name"] = firstname;
    newFormikData.initialValues["family-name"] = lastname;
    newFormikData.initialValues["email"] = email;
    setFormikData(newFormikData);
    setOrigEmail(email);
  };

  return (
    <BasicCourseContainer {...containerStyles}>
      {appComplete ? (
        <HappyAlert p="3">
          <P mb="0">
            ¡Hemos recibido tu solicitud! Te contactaremos dentro de 2 días para
            programar una reunión.
          </P>
        </HappyAlert>
      ) : (
        <>
          {formikData && (
            <Formik
              validationSchema={ApplicationSchema}
              initialValues={formikData.initialValues}
              onSubmit={async (values, actions) => {
                values.origEmail = origEmail;
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
                  <Box display="flex" flexDirection="column" mb={2}>
                    <FieldLabel htmlFor={"startDate"}>
                      Elige una fecha de inicio
                    </FieldLabel>
                    {[
                      ["1 Feb 2022", " (27 inscritos)"],
                      ["1 Mar 2022", "(3 inscritos)"],
                    ].map((choice, idx) => {
                      return (
                        <MultiLabel key={idx}>
                          <Field
                            className="styled-radio"
                            data-cy={"when-field"}
                            mb={2}
                            type="radio"
                            name={"startDate"}
                            value={choice[0]}
                          />
                          {choice[0]}
                          <Note>{choice[1]}</Note>
                        </MultiLabel>
                      );
                    })}
                    {errors["startDate"] && (
                      <Error>{errors["startDate"]}</Error>
                    )}
                    {!origEmail && (
                      <>
                        <Box display="flex" justifyContent="center">
                          <EmailForm
                            gaCategory="registration"
                            showGoogleSignin={true}
                            googleBtnText="Continúa con Google"
                            dividerStyles={dividerStyles}
                            submitBtnText="Continúa con mi email"
                            onFinishSubmitEmail={handleCaptureEmail}
                            onGoogleSignin={handleGoogleSignin}
                            onFacebookSignin={handleFacebookSignin}
                          />
                        </Box>
                      </>
                    )}
                  </Box>
                  {origEmail && (
                    <>
                      {formikData.basicCourseForm.map((field, idx) => {
                        const { fieldName } = field;
                        let fieldJsx;

                        if (field.fieldType === "shortAnswer") {
                          fieldJsx = (
                            <Box
                              display="flex"
                              flexDirection="column"
                              key={idx}
                            >
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
                                    category: "registration",
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
                                    category: "registration",
                                    action: `user focused field ${field.title}`,
                                  });
                                }}
                                onChange={handleChange}
                                value={values[field.fieldName] || ""}
                                // value={values[fieldName] || ""}
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
                                    <span>{choice}</span>
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
                                    category: "registration",
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
                          Ciudad y país. (Lo necesitamos para saber tu zona
                          horaria)
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
                              py="0"
                            >
                              Find me
                            </Button>
                          }
                          id="location"
                          name="location"
                          onFocus={() => {
                            ReactGA.event({
                              category: "registration",
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
                              category: "registration",
                              action: `userRegistered`,
                              label: "appliedLabel",
                            });
                          }}
                        >
                          Solicita mi plaza
                        </Button>
                      </Box>
                    </>
                  )}
                </Form>
              )}
            </Formik>
          )}
        </>
      )}
    </BasicCourseContainer>
  );
};
