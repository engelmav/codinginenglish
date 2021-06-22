import styled from "styled-components";
import { FaRegWindowClose } from "@react-icons/all-files/fa/FaRegWindowClose";
import { flexbox } from "styled-system";


export const CloseBox = styled(FaRegWindowClose)`
  ${flexbox}
  cursor: pointer;
  transition: 0.2s;
  :hover {
    background-color: black;
    color: white;
  }
`;