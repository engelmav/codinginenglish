import styled from "styled-components";
import React from "react";

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
  margin-top: 3px;
  margin-left: 3px;
  padding: 4px;
`;

export const CoverWindowOnDrag = styled.div`
  height: 100%;
  width: 100%;
  z-index: 101;
  position: absolute;
  background-color: lightGray;
`;
