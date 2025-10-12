import React, { useState } from "react";

type GameOverModalProps = {
  isOpen: boolean;
  score: number;
  onSave: (name: string) => void;
};

const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, score, onSave }) => {
  const [playerName, setPlayerName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (playerName.trim() === "") return; // evita nombres vacíos
    onSave(playerName.trim());
    setPlayerName("");
  };

  return (
    <>
      {/* Fondo semitransparente */}
      <div className="modal-backdrop"></div>

      {/* Modal */}
      <div className="modal">
        <h2>🎮 Game Over!</h2>
        <p>Your score: {score}</p>
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button onClick={handleSubmit}>Save Score</button>
      </div>
    </>
  );
};

export default GameOverModal;
