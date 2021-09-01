import React from "react";
import EmailForm from "../components/EmailForm";
import { P } from "../UtilComponents/Typography/Typography";
import { cieApi } from "../services/cieApi";
import settings from "../settings"
import ReactGA from "react-ga"

ReactGA.initialize(settings.gaTrackingId);

const handleCapturedEmail = (userEmail) => {
  ReactGA.event({
    category: "register",
    action: "emailRegistration",
    label: "emailCaptured",
  });
  cieApi.createUserEmail({ email: userEmail, status: "curriculumDownload" });
};

const CurriculumForm = (content) => {
  return (
    <EmailForm
      image={
        <img
          width="60px"
          src="https://cie-assets.nyc3.cdn.digitaloceanspaces.com/email-blue-flaticon-100px.png"
        />
      }
      blurb={
        <P color="white" mb={3} textAlign="center">
          {content.modalContent}
        </P>
      }
      containerStyles={{ p: [3, 4, 4, 4], pt: 0 }}
      submitBtnText={content.buttonText}
      successView={
        <P data-cy="curric-confirmation-text" color="white">
          ¡Enviado! Por favor verifica tu correo electrónico para ver un correo
          de nosotros. El currículo estará anexado.
        </P>
      }
      styleProps={{ mt: [0], pt: 0, alignSelf: "center" }}
      onCaptureEmail={handleCapturedEmail}
    />
  );
};

export default CurriculumForm;
