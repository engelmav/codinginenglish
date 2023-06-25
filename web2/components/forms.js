import styled from "@emotion/styled";

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #333333;
  padding: 30px;
  // @media (max-width: 768px) {
  //   margin: 0 -15px;
  // }
`;
export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  gap: 10px;
  background-color: #333333;
`;

export const FormGroup = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  background-color: transparent;
`;

export const Input = styled.input`
  padding: 10px;
  border: none;
  outline: none;
  font-size: 1rem;
  width: 100%;
  color: #ffffff;
  background-color: black;
  border-radius: 5px;
`;
export const TextArea = styled.textarea`
  padding: 10px;
  border: none;
  outline: none;
  font-size: 1rem;
  width: 100%;
  color: #ffffff;
  background-color: black;
  border-radius: 5px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  background-color: #ff4136;
  color: #ffffff;
  font-size: 1rem;
  border: none;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s;
  box-sizing: border-box;
  border-radius: 5px;
  &:hover {
    background-color: #ff8a8a;
  }
`;

export const P = styled.p`
  color: yellow;
`;
