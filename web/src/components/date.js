import { parseISO, format } from 'date-fns'
import React from "react";


export default function Date({ dateString }) {
  console.log("date string:", dateString)
  const date = parseISO(dateString)
  console.log(date)
  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>
}
