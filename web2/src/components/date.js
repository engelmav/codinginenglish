import { parseISO, format } from 'date-fns'
import React from "react";

import { styled } from "@linaria/react"

const Time = styled.div`
  padding-bottom: 20px;
  color: gray;
  font-weight: 600;
`;

export default function Date({ dateString }) {
  console.log("date string:", dateString)
  const date = parseISO(dateString)
  console.log(date)
  return <Time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</Time>
}
