import React, { useEffect, useState } from "react";
import { ContentSection, Main } from "../UtilComponents";
import styled from "styled-components";

const CallbackContent = styled(ContentSection)`
  align-items: center;
`;

const Callback = () => {
  const [error, setError] = useState(null);
  useEffect(() => {
    const url = new URL(document.location.href.replace(/#/g, "?"));
    const authError = url.searchParams.get("error_description");
    if (authError) {
      setError(authError);
    }
  }, []);

  return (
    <Main>
      <CallbackContent p={"20px"} alignItems="center">
        {error ? (
          <>
            <p>
              Ha ocurrido un problema tratando de iniciar la sesión. El error
              del sistema de autenticación es: `{error}`
            </p>
            <p>
              Hemos registrado el error y te contactaremos lo más pronto posible
              para resolverlo.
            </p>
          </>
        ) : (
          <p>Logging you in / Iniciando la sesión ...</p>
        )}
      </CallbackContent>
    </Main>
  );
};

export default Callback;
