import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
  console.log("Got activities:")
  console.log(activities)
  return (
    <ActivityBorder>
      {
        activities.map(activity => {
          const { activityType, model } = activity;
          if (activityType === "multipleChoice") {
            return <MultipleChoice {...model} />
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