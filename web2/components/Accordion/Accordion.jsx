import React, { useState } from "react";
import styles from "./styles.module.css";

export const Accordion = ({ accordianData }) => {
  return (
    <div>
      <h1>React Accordion Demo</h1>
      <div className={styles.accordian} style={{ backgroundColor: "black" }}>
        {accordianData.map(({ title, content }) => (
          <AccordionPanel title={title} content={content} />
        ))}
      </div>
    </div>
  );
};

export const AccordionPanel = ({ title, content, children }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "#301934",
        gap: "5px",
        marginBottom: "20px",
        marginTop: "20px",
        padding: "30px",
        borderBottom: "3px dotted white",
        maxWidth: "1000px",
        minWidth: "1000px",
        borderRadius: "4px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          border: "1px white solid",
          cursor: "pointer",
          color: "white",
          fontWeight: 900,
          padding: "20px",
          borderRadius: "4px"
        }}
        className="accordion-title"
        onClick={() => setIsActive(!isActive)}
      >
        <div>{title}</div>
        <div style={{ paddingLeft: "10px" }}>
          {isActive ? "Collapse -" : "Expand +"}
        </div>
      </div>
      {isActive && (
        <div
          style={{ padding: "20px", color: "white" }}
        >
          {content}
          {children}
        </div>
      )}
    </div>
  );
};
