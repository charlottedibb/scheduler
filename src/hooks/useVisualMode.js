import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial); //set the mode state with the intital mode provided
  function transition(newMode) {
    setMode(newMode);
  }
  
  return {
    mode,
    transition
  }
}