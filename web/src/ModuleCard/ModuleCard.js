import { ContentSection, Title, RegisterLink } from "../UtilComponents";
import { cieOrange, fontMonospace } from "../UtilComponents/sharedStyles";
import { P, TitleH2 } from "../UtilComponents/Typography/Typography";
import { CloseBox } from "../UtilComponents/CloseBox/CloseBox";
// import { toLocalTime } from "../util";
import Dialog from "@material-ui/core/Dialog";
import { useMediaQuery } from "@material-ui/core";
import styled from "styled-components";
import { Flex, Text, Image } from "rebass";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import settings from "../settings";


const CardBox = styled(Flex)`
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
  height: 100%;
`;

const ModuleCard = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const isFullscreen = useMediaQuery("(max-width: 40em)");
  useEffect(() => setFullScreen(isFullscreen), []);

  const { CheckoutForm } = props;
  const {
    title: courseTitle,
    description,
    course_instances: courseInstances,
  } = props.moduleData;
  return (
    <>
      <CardBox sx={{ borderRadius: 15 }} p={20} mb={20}>
        <Image
          sx={{ "@media screen and (max-width: 500px)": { display: "none" } }}
          src={`${settings.assets}/upcoming-sessions/computer-city-nighttime.png`}
          alt={courseTitle}
          mr={2}
          width="50%"
        />

        <TitleH2 py={4} fontWeight="bold" color="primary" textAlign="center">
          {courseTitle}
        </TitleH2>

        <P>{description}</P>
        <P>del 20 septiembre al 20 diciembre</P>
        {courseInstances.map((ms, idx) => {
          return (
            <RegisterLink mt={3} p={2}  key={idx} href="/apply">
              ¡Inscríbeme ahora!
            </RegisterLink>
          );
        })}
      </CardBox>

      <Dialog
        open={dialogOpen}
        onBackdropClick={() => setDialogOpen(false)}
        fullScreen={fullScreen}
      >
        <DialogContent flexDirection="column" p={20}>
          <CloseBox
            size="30"
            alignSelf="flex-end"
            onClick={() => setDialogOpen(false)}
          />
          <TitleH2>{courseTitle}</TitleH2>

          <ContentSection>
            {/* {appStore.authData == null && (
              <>
                <P>Already registered as a student? Sign in!</P>
                <P>
                  Otherwise, register for this class as a guest. You can create
                  a student profile later.
                </P>
              </>
            )} */}
          </ContentSection>
          {/* <CheckoutForm
            // sessionData={sessionData}
            onCloseClick={() => setDialogOpen(false)}
          /> */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModuleCard;
