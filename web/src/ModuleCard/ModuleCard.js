import Modal from "react-modal";
import { Button, ContentSection, Title } from "../UtilComponents";
import { toLocalTime } from "../util";
import { FaRegWindowClose } from "react-icons/fa";
import Dialog from "@material-ui/core/Dialog";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Flex, Text, Image } from "rebass";

import React, { useState } from "react";

const ShadowBox = styled(Flex)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2);
  transition: 0.2s;
  :hover {
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.2);
  }
`;

const DialogContent = styled(Flex)`
  flex-direction: column;
`;

const CloseBox = styled(FaRegWindowClose)`
  align-self: flex-end;
  cursor: pointer;
  transition: 0.2s;
  :hover {
    background-color: black;
    color: white;
  }
`;

export const ModuleCard = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const { appStore, CheckoutForm, settings } = props;
  const {
    name: moduleName,
    description: moduleDescription,
    module_sessions: moduleSessions,
  } = props.moduleData;
  return (
    <>
      <ShadowBox sx={{ borderRadius: 15 }} p={20} mb={20}>
        <Image
          sx={{ "@media screen and (max-width: 500px)": { display: "none" } }}
          src={`${settings.assets}/lego-man-key-250.jpeg`}
          alt={moduleName}
          mr={2}
          width="50%"
        />

        <Text
          as="h1"
          m={3}
          fontSize={[3, 4, 5]}
          fontWeight="bold"
          color="primary"
          textAlign="center"
        >
          {moduleName}
        </Text>

        <Text as="p" m={1}>
          {moduleDescription}
        </Text>
        <p>Choose a start time:</p>
        {moduleSessions.map((ms, index) => {
          const sessionDtLocalTime = toLocalTime(ms._session_datetime);
          return (
            <Button
              key={index}
              m={1}
              alignSelf="center"
              maxWidth="500px"
              onClick={() => {setDialogOpen(true); setSelectedSession(sessionDtLocalTime)}}
            >
              {sessionDtLocalTime}
            </Button>
          );
        })}
      </ShadowBox>

      <Dialog open={dialogOpen} onBackdropClick={() => setDialogOpen(false)}>
        <DialogContent flexDirection="column" p={20}>
          <CloseBox onClick={() => setDialogOpen(false)} />
          <Title>{moduleName}</Title>

          <ContentSection>
            <p>This class begins on <b>{selectedSession}</b>.</p>
            {appStore.authData == null && (
              <>
                <p>Already registered as a student? Sign in!</p>
                <p>
                  Otherwise, register for this class as a guest. You can create
                  a student profile later.
                </p>
              </>
            )}
          </ContentSection>
          <CheckoutForm
            // sessionData={sessionData}
            onCloseClick={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
