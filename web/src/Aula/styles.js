import styled from "styled-components";
import { HiUserGroup } from "@react-icons/all-files/hi/HiUserGroup";


export const ClassroomContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
export const ClassroomHeader = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  justify-self: stretch;
  background-color: black;
  padding: 5px;
  width: 100%;
`;

export const Taskbar = styled.div`
  display: inline;
  border-radius: 3px;
  margin-left: 3px;
`;

export const CoverWindowOnDrag = styled.div`
  height: 100%;
  width: 100%;
  z-index: 101;
  position: absolute;
  background-color: lightGray;
`;

export const RoomStatus = styled.div`
  color: white;
`

export const GroupIcon = styled(HiUserGroup)`
  color: white;
  margin-left: 10px;
  margin-right: 10px;
`