import React, { useState } from "react";
import { Formik, Field, Form as _Form } from "formik";
import styled from "styled-components";
import {
  TextInput,
  Button,
  Main,
  Title,
  ContentSection,
} from "../UtilComponents";
import { P, TitleH2 } from "../UtilComponents/Typography/Typography";
import { basicCourseForm } from "./formsData";
import * as Yup from "yup";
import {
  fontFamily,
  inputPadding,
  lgInputFontSize,
  smInputFontSize,
  whenSmallScreen,
  cieOrange,
} from "../UtilComponents/sharedStyles";

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
  location: Yup.string().required(
    "Favor de decirnos el pais y la ciudad en que resides"
  ),
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

const Timeline = styled.div`
  .container {
    margin: auto;
  }

  li {
    margin-bottom: 25px;
  }

  .timeline {
    counter-reset: test 0;
    position: relative;
  }

  .timeline li {
    list-style: none;
    float: left;
    width: 33.3333%;
    position: relative;
    text-align: center;
    text-transform: uppercase;
  }

  ul {
    padding: 0;
  }

  ul:nth-child(1) {
    ${whenSmallScreen`
      font-size: .6rem;`}
    color: black;
  }

  .timeline li:before {
    counter-increment: test;
    content: counter(test);
    width: 50px;
    height: 50px;
    border: 3px solid ${cieOrange};
    border-radius: 50%;
    display: block;
    text-align: center;
    line-height: 50px;
    margin: 0 auto 10px auto;
    background: #fff;
    color: #000;
    transition: all ease-in-out 0.3s;
  }

  .timeline li:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: grey;
    top: 25px;
    left: -50%;
    z-index: -999;
    transition: all ease-in-out 0.3s;
  }

  .timeline li:first-child:after {
    content: none;
  }
  .timeline li.active-tl {
    color: black;
  }
  .timeline li.active-tl:before {
    background: ${cieOrange};
    color: white;
  }

  .timeline li.active-tl + li:after {
    background: ${cieOrange};
  }
`;

const MainAppl = styled(Main)`
  width: min(90%, 700px);
`;

export const BasicCourseForm = ({ cieApi }) => {
  const [appComplete, setAppComplete] = useState(false);
  const initialValues = {};
  basicCourseForm.forEach((field) => {
    initialValues[field.fieldName] = field.initialValue
      ? field.initialValue
      : "";
  });

  return (
    <MainAppl p={20}>
      <Title textAlign="center">Webapp Development - Basic</Title>
      <P textAlign="center"><i>del 20 septiembre al 20 diciembre</i></P>
      <Timeline>
        <ul class="timeline">
          <li class="active-tl">Solicitud</li>
          <li>Entrevista</li>
          <li>Matrícula</li>
        </ul>
      </Timeline>
      {appComplete ? (
        <p>
          Gracias por completar la solicitud! Te contactaremos dentro de 2 días
          para hablar de los próximos pasos.
        </p>
      ) : (
        <>
          <P>
            El proceso de matriculación de Coding in English consta de tres
            pasos:
          </P>
          <ol>
            <li>Rellenar la solicitud del curso.</li>
            <li>
              Entrevista con un instructor con el fin de averiguar tus objetivos
              y algunos temas técnicos.
            </li>
            <li>Matrícula para el curso</li>
          </ol>

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
            }) => (
              <Form onSubmit={handleSubmit}>
                {basicCourseForm.map((field) => {
                  const { fieldName } = field;
                  if (field.fieldType === "shortAnswer") {
                    return (
                      <>
                        <FieldLabel htmlFor={field.title}>
                          {field.title}
                        </FieldLabel>
                        <TextInput
                          autocomplete="false"
                          type="text"
                          id={fieldName}
                          name={fieldName}
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
                        <FieldLabel htmlFor={field.title}>
                          {field.title}
                        </FieldLabel>
                        <TextInput
                          type="email"
                          id={fieldName}
                          name={fieldName}
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
                        <FieldLabel htmlFor={field.title}>
                          {field.title}
                        </FieldLabel>
                        {field.choices.map((choice) => {
                          return (
                            <MultiLabel>
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
                        {field.choices.map((choice) => {
                          return (
                            <MultiLabel>
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
                        <FieldLabel htmlFor={field.title}>
                          {field.title}
                        </FieldLabel>
                        <TextInput
                          as="textarea"
                          name={fieldName}
                          value={values[field.fieldName]}
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
                <Button type="submit">Submit</Button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </MainAppl>
  );
};
