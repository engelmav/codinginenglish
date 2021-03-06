import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../UtilComponents/Button';


const ActivityBorder = styled.div`
  background: white;
  border: 1px black solid;
`

const GrayBorder = styled.div`
  border: 1px solid gray;
  padding: 5px;
  margin: 5px;
`;

const RadioButton = styled.input.attrs(() => ({type: "radio"}))`
`

const MultipleChoice = ({ question, answer, choices }) => {
  const [selectedOpt, setSelectedOpt] = useState(null)
  return (
    <GrayBorder>
      <p>{question}</p>
      {
        choices.map((opt, idx) => {
          return (
            <label key={idx}>
              <RadioButton type="radio" value={opt} onChange={e => setSelectedOpt(e.target.value)} checked={selectedOpt === opt} />
              {opt}
            </label>
          );
        })
      }
    </GrayBorder>
  );
};

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;

const PopupActivity = ({ onClose, activities }) => {
  // Resume here:
  // implement callback (or mobx class) to collect responses from child component
  // and send them to backend when student clicks "DONE!"
  return (
    <ActivityBorder>
      {
        activities.map(activity => {
          const { activityType, model } = activity;
          if (activityType === "multipleChoice") {
            return <MultipleChoice {...model} />
          } else {
            return <div></div>;
          }
        })
      }
      <Footer>
        <Button m={2} justifySelf="center" onClick={onClose}>DONE!</Button>
      </Footer>
      
    </ActivityBorder>

  )
}


export { PopupActivity };