import Layout from "../components/Layout";
import { authLazy } from "../auth/AuthLazy";
import { compose } from "../compose";
import { getStaticProps } from "../cmsLocaleStaticLoader";
import React, { useEffect, useState } from "react";
import { ContentSection, Main } from "../UtilComponents";
import styled from "styled-components";
import Router from "next/router";
import reactor from "../reactor";
import { handleAuthSuccess } from "../eventHandlers";
import { AppStoreProvider } from "../stores/appStoreReact";

export { getStaticProps };

const CallbackContent = styled(ContentSection)`
  align-items: center;
`;

const CallbackView = (props) => {
  const [error, setError] = useState(null);
  useEffect(() => {
    async function init() {
      const auth = await authLazy.create();
      reactor.registerEvent("auth_success");
      reactor.addEventListener("auth_success", handleAuthSuccess);
      auth.checkRoute(Router.router.asPath);
      const url = new URL(document.location.href.replace(/#/g, "?"));
      const authError = url.searchParams.get("error_description");
      if (authError) {
        setError(authError);
      }
    }
    init();
  }, []);

  return (
    <AppStoreProvider>
      <Layout {...props}>
        <Main>
          <CallbackContent p={"20px"} alignItems="center">
            {error ? (
              <>
                <p>
                  Ha ocurrido un problema tratando de iniciar la sesión. El
                  error del sistema de autenticación es: `{error}`
                </p>
                <p>
                  Hemos registrado el error y te contactaremos lo más pronto
                  posible para resolverlo.
                </p>
              </>
            ) : (
              <p>Inscribiéndote en Coding in English ...</p>
            )}
          </CallbackContent>
        </Main>
      </Layout>
    </AppStoreProvider>
  );
};

export default CallbackView;
