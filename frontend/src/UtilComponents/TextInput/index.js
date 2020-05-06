import styled from 'styled-components';


const TextInput = styled.input.attrs(props => ({ type: 'text' }))`
  border-radius: 3px;
`;

export { TextInput };