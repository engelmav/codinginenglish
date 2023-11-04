import RegistrationForm from "../../CourseApplications/RegistrationForm";
import Layout from "../../components/Layout";
import React from "react";
import { getStaticProps } from "../../cmsLocaleStaticLoader";
import { authLazy } from "../../auth/AuthLazy";
import appStoreLazy from "../../stores/AppStoreLazy";
import { cieApi } from "../../services/cieApi";
import { AppStoreProvider } from "../../stores/appStoreReact";
export { getStaticProps };
import { TitleH1, P } from "../../UtilComponents/Typography/Typography";
import { ContentSection } from "../../UtilComponents";

const RegistrationView = (props) => (
  <AppStoreProvider>
    <Layout {...props}>
      <ContentSection px="3" pt={[0, 5]} pb={[4, 5]}>
        <TitleH1 mt={[3, 3, 4, 4, 5]} pb="3" textAlign="center">
          Solicita una plaza
        </TitleH1>
        <P textAlign="center">El éxito de la tecnología nos peretence a todos. </P>
        <P textAlign="center">
          Participa en el primer curso en el mundo que enseña ambas competancias
          que necesitas para entrar en la carrera de más crecimiento del mundo: la
          programación.
        </P>
        <P textAlign="center">Los cursos se dan en línea con la opción de asistir en persona.</P>
        <RegistrationForm
          authLazy={authLazy}
          appStoreLazy={appStoreLazy}
          cieApi={cieApi}
          dividerStyles={{ background: "black", color: "black" }}
        />
      </ContentSection>
    </Layout>
  </AppStoreProvider>
);

export default RegistrationView;
