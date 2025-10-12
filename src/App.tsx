import React, { useState } from "react";
import "./App.css";
import StartScreen from "./StartScreen";
import Game from "./Game"; 

const App: React.FC = () => {
  const [started, setStarted] = useState(false);

  return (
    <>
      {started ? (
        <Game onGoBack={() => setStarted(false)} />
      ) : (
        <StartScreen onStart={() => setStarted(true)} />
      )}
    </>
  );
};

export default App;
