import React from "react";
import fondo1 from './images/fondo1.webp'; // Importar la imagen de fondo

type StartScreenProps = {
  onStart: () => void;
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const style = {
    backgroundImage: `url(${fondo1})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="start-screen" style={style}>
      <button onClick={onStart} className="start-game-btn">Start Game</button>
    </div>
  );
};

export default StartScreen;
