import { useState, useEffect } from "react";

import { P } from "./Typography";
export function TypewriterText({ children }) {
  const first_text = "const sayHello = () = {";
  const [text1, setText1] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setText1(children.slice(0, text1.length + 1));
    }, 10);
    return () => clearTimeout(timeout);
  }, [text1]);

  return <P style={{ color: "black" }}>{text1}</P>;
}
