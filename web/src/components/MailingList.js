import React from "react";
import {H2, P} from "../UtilComponents/Typography/Typography"
import EmailForm from "./EmailForm"
import { HappyAlert } from "./Alerts";
import { cieApi } from "../services/cieApi";

export const MailingList = ({headerStyles}) => {
  return (
    <>
      <H2 {...headerStyles}>Manténte al tanto</H2>
      <P mb="4" color="#370E00">
        {" "}
        Recibe notificaciones sobre clases de muestra, nuevas clases, y nuestro
        newsletter con consejos de aprendizaje sobre la programación e inglés, y
        para saber más de nosotros.
      </P>
      <EmailForm
        submitBtnText="¡Manténme informado!"
        containerStyles={{
          background: "transparent",
          width: "100%",
          maxWidth: "400px",
        }}
        onCaptureEmail={(email) =>
          cieApi.createUserEmail({ email, status: "subscribeForUpdates" })
        }
        successView={
          <HappyAlert>
            <P textAlign="center">
              Estarás notificado de nuevos acontecimientos en Coding in English
            </P>
          </HappyAlert>
        }
      />
    </>
  );
};
