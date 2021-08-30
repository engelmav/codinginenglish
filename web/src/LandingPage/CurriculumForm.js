import React from "react";
import EmailForm from "../components/EmailForm"
import { P}  from "../UtilComponents/Typography/Typography"

const CurriculumForm = () => {
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
          Consigue las dos competencias más cotizadas del mundo. Al mismo.
        </P>
      }
      containerStyles={{p:[3, 4, 4, 4], pt:0}}
      submitBtnText="Envíamelo!"
      styleProps={{ mt: [0], pt: 0, alignSelf: "center" }}
      onCaptureEmail={() => "do stuff"}
    />
  );
};

export default CurriculumForm;