import styled from "styled-components";
import React, { useState } from "react";


const GrayBorder = styled.div`
  border: 1px solid gray;
  padding: 5px;
  margin: 5px;
`;

const RadioButton = styled.input.attrs(() => ({ type: "radio" }))`

`;

export const MultipleChoice = ({ question, answer, choices }) => {
  const [selectedOpt, setSelectedOpt] = useState(null);
  return (
    <GrayBorder>
      <p>{question}</p>
      {choices.map((opt, idx) => {
        return (
          <label key={idx}>
            <RadioButton
              type="radio"
              value={opt}
              onChange={(e) => setSelectedOpt(e.target.value)}
              checked={selectedOpt === opt}
            />
            {opt}
          </label>
        );
      })}
    </GrayBorder>
  );
};