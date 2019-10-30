import React, { useState } from "react";

export default function useVisualMode(initial) {
  //sets the mode state with the intital mode passed in
  const [mode, setMode] = useState(initial);

  // initializes history as an array with the intial mode pased in 
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace) {
    setMode(mode); //updates mode with new mode value
    if (replace) {
      setHistory([...history.slice(0, history.length - 1), mode]); //adds new mode to history
    } else {
      setHistory([...history, mode]); //adds new mode to history
    }
  }

  function back() {
    if (history.length > 1) {
      setMode(history[history.length - 2]); // sets mode to 2nd last item in history array
      setHistory(history.slice(0, history.length - 1)); //removes last mode from history
    }
  }

  return {
    mode,
    transition,
    back
  }
}