import React from "react";
import { useHighScoresStore } from "./useHighScoresStore";

type HighScoresModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const HighScoresModal: React.FC<HighScoresModalProps> = ({ isOpen, onClose }) => {
  const { scores } = useHighScoresStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Fondo semitransparente */}
      <div className="modal-backdrop" onClick={onClose}></div>

      {/* Modal */}
      <div className="modal">
        <h2>🏆 High Scores</h2>
        <ul>
          {scores.length > 0 ? (
            scores.map((s, i) => (
              <li key={i}>
                {i + 1}. {s.name} - {s.score} pts
              </li>
            ))
          ) : (
            <li>No scores yet</li>
          )}
        </ul>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
};

export default HighScoresModal;
