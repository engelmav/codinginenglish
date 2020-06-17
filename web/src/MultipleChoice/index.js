import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Button } from '../UtilComponents/Button';


const ExerciseContainer = styled.div`
  background: white;
  border: 1px black solid;
`

const GrayBorder = styled.div`
  border: 1px solid gray;
  padding: 5px;
  margin: 5px;
`;

const Question = ({ questionBody, options }) => {
  const [selectedOpt, setSelectedOpt] = useState(null)
  return (
    <GrayBorder>
      <p>{questionBody}</p>
      {
        options.map((opt, idx) => {
          return (
            <label key={idx}>
              <input type="radio" value={opt} onChange={e => setSelectedOpt(e.target.value)} checked={selectedOpt === opt} />
              {opt}
            </label>
          );
        })
      }
    </GrayBorder>
  );
};


const MultipleChoice = ({onClose}) => {
  return (
    <ExerciseContainer>
      <Question
        questionBody={"Andrea's prices may need to ____ when another restaurant comes to town with cheap prices."}
        options={["go down", "stay the same", "go up"]}
        answer="go down"
      />
      <Question
        questionBody={"You can calculate ____ by multiplying your price by 0.10, and adding that to your original price."}
        options={["a discount", "sales tax", "your tip"]}
        answer="sales tax"
      />
      <Question
        questionBody={"Andrea wants us to build software so he can ____."}
        options={["sell his food in his store", "calculate tips", "sell his food online"]}
        answer="sell his food online"
      />
      <Button onClick={onClose}>DONE!</Button>
    </ExerciseContainer>

  )
}


export { MultipleChoice };