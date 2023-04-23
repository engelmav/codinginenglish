import React from "react";
import Script from "next/script";

const embedCode = `
  function exampleCallback(data) {
    console.log(data)
  }
  window.EBWidgets.createWidget({
    widgetType: 'checkout',
    eventId: '610379289887',
    modal: true,
    modalTriggerElementId: 'yolo',
    onOrderComplete: exampleCallback,
});
window.EBWidgets.createWidget({
    widgetType: 'checkout',
    eventId: '610385719117',
    modal: true,
    modalTriggerElementId: 'yolo1',
    onOrderComplete: exampleCallback,
});
  `;
const SomePage = () => {
  return (
    <div>
      <Script
        beforeInteractive
        src="https://www.eventbrite.com/static/widgets/eb_widgets.js"
      />
      <Script
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: embedCode,
        }}
      />

      <h1>My Events</h1>
      <div id="yolo"></div>
    </div>
  );
};

export default SomePage;
