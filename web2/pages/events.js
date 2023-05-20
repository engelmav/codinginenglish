import React, { useEffect } from "react";
import Script from "next/script";
import { Button } from "../components/Button";
import { P, H1, H2, H3 } from "../components/typography";
import tw, { styled } from "twin.macro";

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  button {
    min-width: 200px;
    padding: 1rem;
  }
`;

const EventDate = styled(P)`
  padding-top: 1rem;
  padding-bottom: .2rem;
`;

const EventsPage = () => {
  useEffect(() => {
    if (window && document) {
      const script = document.createElement("script");
      script.src = "https://www.eventbrite.com/static/widgets/eb_widgets.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        window.EBWidgets.createWidget({
          widgetType: "checkout",
          eventId: "610379289887",
          modal: true,
          modalTriggerElementId: "yolo",
        });
      };
    }
  }, []);
  return (
    <div>
      <H1 tw="sm:my-10 lg:my-20">Eventos</H1>

      <H2 tw="my-5">
        Clases de muestra gratis, con horarios de Estados Unidos y Europa
      </H2>
      <P>
        Visítanos <i>en vivo</i> en una de nuestras clases de muestra o
        webinars. Te enterarás de cómo enseñamos enseñar programación e inglés
        efectivamente, y cómo aprovechamos este currículo para conseguirte
        trabajo en la nueva carrera global de programación. Y saldrás
        aprendiendo algo nuevo de programación e inglés... ¡gratis!
      </P>

      <P>¡Elige una clase de muestra abajo e inscríbete!</P>
      <Buttons>
        <EventDate>07 mayo 2023 // 12:00 CET</EventDate>
        <Button id="yolo">Book</Button>
        <EventDate>14 mayo 2023 // 5:00pm EST</EventDate>

        <Button id="yolo">Book</Button>
        <EventDate>18 mayo 2023 // 12:00 CET</EventDate>
        <Button id="yolo">Book</Button>
        <EventDate>25 mayo 2023 // 6:00pm EST</EventDate>
        <Button id="yolo">Book</Button>
      </Buttons>
    </div>
  );
};

export default EventsPage;
