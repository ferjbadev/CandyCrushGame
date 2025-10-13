import React from "react";
import background2 from './images/background2.png';

type StartScreenProps = {
  onStart: () => void;
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const style = {
    backgroundImage: `url(${background2})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="start-screen" style={style}>
      <h1 className="game-title">Sweet Clash</h1>
      <button onClick={onStart} className="start-game-btn">Start Game</button>
    </div>
  );
};

export default StartScreen;
