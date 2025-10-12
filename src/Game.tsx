import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import blueCandy from "./images/blue-candy.png";
import greenCandy from "./images/green-candy.png";
import orangeCandy from "./images/orange-candy.png";
import purpleCandy from "./images/purple-candy.png";
import redCandy from "./images/red-candy.png";
import yellowCandy from "./images/yellow-candy.png";
import blank from "./images/blank.png";
import HighScoresModal from "./HighScores";
import GameOverModal from "./GameOverModal";
import { useHighScoresStore } from "./useHighScoresStore";
import Timer from "./Timer";

type Candy = {
  color: string;
  modifier?: string;
};

const WIDTH = 8;
const candyColors = [blueCandy, greenCandy, orangeCandy, purpleCandy, redCandy, yellowCandy];

const Game: React.FC = () => {
  const [candies, setCandies] = useState<Candy[]>([]);
  const [candieDragged, setCandieDragged] = useState<HTMLDivElement | null>(null);
  const [candieToReplace, setCandieToReplace] = useState<HTMLDivElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScoresOpen, setHighScoresOpen] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hasSavedScore, setHasSavedScore] = useState(false); // evita guardar doble

  const addHighScore = useHighScoresStore((state) => state.addScore);

  const updateScore = useCallback((num: number) => setScore(prev => prev + num), []);

  const playSound = (soundId: string) => {
    const sound = document.getElementById(soundId) as HTMLAudioElement | null;
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(console.error);
    }
  };

  const moveIntoSquareBelow = useCallback(() => {
    const newCandies = [...candies];
    let moved = false;

    for (let i = 0; i < WIDTH * WIDTH - WIDTH; i++) {
      if (newCandies[i + WIDTH].color === blank) {
        newCandies[i + WIDTH].color = newCandies[i].color;
        newCandies[i].color = blank;
        moved = true;
      }
    }

    for (let i = 0; i < WIDTH; i++) {
      if (newCandies[i].color === blank) {
        newCandies[i].color = candyColors[Math.floor(Math.random() * candyColors.length)];
        moved = true;
      }
    }

    if (moved) setCandies(newCandies);
    return moved;
  }, [candies]);

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => setCandieDragged(e.currentTarget);
  const dragDrop = (e: React.DragEvent<HTMLDivElement>) => setCandieToReplace(e.currentTarget);

  const dragEnd = () => {
    if (candieDragged && candieToReplace) {
      const dragIndex = parseInt(candieDragged.getAttribute("data-index") || "-1");
      const replaceIndex = parseInt(candieToReplace.getAttribute("data-index") || "-1");

      const validMoves = [dragIndex - 1, dragIndex - WIDTH, dragIndex + 1, dragIndex + WIDTH].filter(
        i => i >= 0 && i < WIDTH * WIDTH
      );

      if (validMoves.includes(replaceIndex)) {
        const newCandies = [...candies];
        [newCandies[dragIndex].color, newCandies[replaceIndex].color] = [
          newCandies[replaceIndex].color,
          newCandies[dragIndex].color,
        ];
        setCandies(newCandies);
      } else playSound("negative_switch");
    }
    setCandieDragged(null);
    setCandieToReplace(null);
  };

  const checkForColumns = useCallback(
    (count: number) => {
      let changed = false;
      const newCandies = [...candies];
      for (let i = 0; i < WIDTH * WIDTH - WIDTH * (count - 1); i++) {
        const column = Array.from({ length: count }, (_, k) => i + k * WIDTH);
        const color = newCandies[i]?.color;
        if (!color || color === blank) continue;
        if (column.every(index => newCandies[index] && newCandies[index].color === color)) {
          column.forEach(index => (newCandies[index].color = blank));
          updateScore(count * 10);
          playSound("match");
          changed = true;
        }
      }
      if (changed) setCandies(newCandies);
      return changed;
    },
    [candies, updateScore]
  );

  const checkForRows = useCallback(
    (count: number) => {
      let changed = false;
      const newCandies = [...candies];
      for (let i = 0; i < WIDTH * WIDTH; i++) {
        if (i % WIDTH > WIDTH - count) continue;
        const row = Array.from({ length: count }, (_, k) => i + k);
        const color = newCandies[i]?.color;
        if (!color || color === blank) continue;
        if (row.every(index => newCandies[index] && newCandies[index].color === color)) {
          row.forEach(index => (newCandies[index].color = blank));
          updateScore(count * 10);
          playSound("match");
          changed = true;
        }
      }
      if (changed) setCandies(newCandies);
      return changed;
    },
    [candies, updateScore]
  );

  const createBoard = () => {
    const randomCandies: Candy[] = [];
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      randomCandies.push({ color: candyColors[Math.floor(Math.random() * candyColors.length)] });
    }
    setCandies(randomCandies);
  };

  useEffect(() => createBoard(), []);
  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumns(4);
      checkForRows(4);
      checkForColumns(3);
      checkForRows(3);
      moveIntoSquareBelow();
    }, 100);
    return () => clearInterval(timer);
  }, [checkForColumns, checkForRows, moveIntoSquareBelow]);

  // ---- Función para reiniciar el juego ----
  const resetGame = () => {
    setScore(0);
    createBoard();
    setGameOver(false);
    setHasSavedScore(false); // resetea flag para permitir guardar el próximo score
  };

  return (
    <div className="app">
      <div className="score-board">
        <span>Score: </span>
        <b>{score}</b>
      </div>

      <Timer
        duration={180} // 3 minutos
        onExpire={() => setGameOver(true)}
        gameOver={gameOver}
      />

      {/* Botón de High Scores */}
      <button className="high-scores-btn" onClick={() => setHighScoresOpen(true)}>
        High Scores
      </button>

      <div className="game">
        {candies.map(({ color, modifier }, index) => (
          <div
            key={index}
            className={`img-container ${color !== blank && modifier ? modifier : ""}`}
            data-src={color}
            data-index={index}
            data-modifier={modifier}
            draggable
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          >
            <img src={color} alt={`candy-${index}`} draggable={false} />
          </div>
        ))}
      </div>

      {/* Modal de High Scores */}
      <HighScoresModal isOpen={highScoresOpen} onClose={() => setHighScoresOpen(false)} />

      {/* Modal de Game Over */}
      <GameOverModal
        isOpen={gameOver}
        score={score}
        onSave={(name) => {
          if (!hasSavedScore) {
            addHighScore(name, score); // guarda score solo una vez
            setHasSavedScore(true);
            resetGame(); // reinicia el juego
          }
        }}
      />

      {/* Sonidos */}
      <audio id="line_blast" src="/sounds/line_blast.ogg" preload="auto"></audio>
      <audio id="striped_candy_created" src="/sounds/striped_candy_created.ogg" preload="auto"></audio>
      <audio id="negative_switch" src="/sounds/negative_switch.ogg" preload="auto"></audio>
      <audio id="match" src="/sounds/new_game.ogg" preload="auto"></audio>
    </div>
  );
};

export default Game;
