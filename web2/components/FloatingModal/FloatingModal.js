import { GoogleDoc } from "../GoogleDoc";
import { useState } from "react";


export const FloatingModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const modalStyle = {
    position: "fixed",
    zIndex: 20,
    top: 0,
    left: 0,
    width: "70%",
    height: "100%",
    background: "white",
    boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.5)",
    transform: isOpen ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s ease",
    display: "flex",
    flexDirection: "column",
  };

  const tabStyle = {
    position: "fixed",
    top: "50%",
    left: 0,
    width: "30px",
    height: "100px",
    background: "grey",
    writingMode: "vertical-rl",
    textAlign: "center",
    transform: isOpen ? "translateX(-100%) translateX(30px)" : "translateX(0)",
    transition: "transform 0.3s ease",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const closeBtnStyle = {
    display: "block",
    margin: "10px",
    padding: "5px 10px",
    border: "4px solid black",
    alignSelf: "end",
  };

  return (
    <div>
      {/* Thin tab or icon that opens the modal */}
      <div style={tabStyle} onClick={() => setIsOpen(true)}>
        <span>Notes</span>
      </div>

      {/* Modal content */}
      <div style={modalStyle}>
        {isOpen && (
          <>
            <button style={closeBtnStyle} onClick={() => setIsOpen(false)}>
              Close
            </button>
            <GoogleDoc
              width="100%"
              height="100%"
              googleDocLink="https://docs.google.com/document/d/1w0Xj5Pp-uCikVJSZh_19x3Zb1T5YSX9gEy_2HyOVeLU/edit?usp=sharing?embedded=true"
            />
          </>
        )}
      </div>
    </div>
  );
};
