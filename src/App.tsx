import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import blueCandy from './images/blue-candy.png';
import greenCandy from './images/green-candy.png';
import orangeCandy from './images/orange-candy.png';
import purpleCandy from './images/purple-candy.png';
import redCandy from './images/red-candy.png';
import yellowCandy from './images/yellow-candy.png';
import blank from './images/blank.png';

type Candy = {
  color: string;
  modifier?: string;
};

const WIDTH = 8;
const candyColors = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
];

const App = () => {
  const [candies, setCandies] = useState<Candy[]>([]);
  const [candieDragged, setCandieDragged] = useState<HTMLDivElement | null>(null);
  const [candieToReplace, setCandieToReplace] = useState<HTMLDivElement | null>(null);
  const [score, setScore] = useState(0);

  const updateScore = useCallback((num: number) => {
    setScore(prevScore => prevScore + num);
  }, []);

  const playSound = (soundId: string) => {
    const sound = document.getElementById(soundId) as HTMLAudioElement | null;
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => console.error('Error playing sound:', error));
    }
  };


  const moveIntoSquareBelow = useCallback(() => {
    const newCandies = [...candies];
    let moved = false;
    // Mueve los caramelos existentes hacia abajo
    for (let i = 0; i < (WIDTH * WIDTH - WIDTH); i++) {
      if (newCandies[i + WIDTH].color === blank) {
        newCandies[i + WIDTH].color = newCandies[i].color;
        newCandies[i].color = blank;
        moved = true;
      }
    }
    // Genera nuevos caramelos en la fila superior
    for (let i = 0; i < WIDTH; i++) {
      if (newCandies[i].color === blank) {
        const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
        newCandies[i].color = randomColor;
        moved = true;
      }
    }

    if (moved) {
      setCandies(newCandies);
    }
    return moved;
  }, [candies]);

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setCandieDragged(e.currentTarget);
  };

  const dragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setCandieToReplace(e.currentTarget);
  };

  const dragEnd = () => {
    if (candieDragged && candieToReplace) {
      const candieDraggedIndex = parseInt(candieDragged.getAttribute('data-index') || '-1');
      const candieToReplaceIndex = parseInt(candieToReplace.getAttribute('data-index') || '-1');

      const validMoves = [
        candieDraggedIndex - 1, candieDraggedIndex - WIDTH,
        candieDraggedIndex + 1, candieDraggedIndex + WIDTH
      ].filter(index => index >= 0 && index < WIDTH * WIDTH);

      const validMove = validMoves.includes(candieToReplaceIndex);

      if (validMove) {
        const newCandies = [...candies];
        const tempColor = newCandies[candieDraggedIndex].color;
        newCandies[candieDraggedIndex].color = newCandies[candieToReplaceIndex].color;
        newCandies[candieToReplaceIndex].color = tempColor;
        setCandies(newCandies);

      } else {
        playSound('negative_switch');
      }
    }
    setCandieDragged(null);
    setCandieToReplace(null);
  };

  const checkForColumns = useCallback((count: number) => {
    let changed = false;
    const newCandies = [...candies];
    for (let i = 0; i < WIDTH * WIDTH - (WIDTH * (count - 1)); i++) {
      const column = Array.from({ length: count }, (_, k) => i + k * WIDTH);
      const color = newCandies[i]?.color;
      if (!color || color === blank) continue;
      if (column.every(index => newCandies[index] && newCandies[index].color === color)) {
        column.forEach(index => { newCandies[index].color = blank; });
        updateScore(count * 10);
        playSound('match');
        changed = true;
      }
    }
    if (changed) setCandies(newCandies);
    return changed;
  }, [candies, updateScore]);

  const checkForRows = useCallback((count: number) => {
    let changed = false;
    const newCandies = [...candies];
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      if (i % WIDTH > WIDTH - count) continue;
      const row = Array.from({ length: count }, (_, k) => i + k);
      const color = newCandies[i]?.color;
      if (!color || color === blank) continue;
      if (row.every(index => newCandies[index] && newCandies[index].color === color)) {
        row.forEach(index => { newCandies[index].color = blank; });
        updateScore(count * 10);
        playSound('match');
        changed = true;
      }
    }
    if (changed) setCandies(newCandies);
    return changed;
  }, [candies, updateScore]);

  const createBoard = () => {
    const randomCandies: Candy[] = [];
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      randomCandies.push({ color: randomColor });
    }
    setCandies(randomCandies);
  };

  useEffect(() => {
    createBoard();
  }, []);

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

  return (
    <div className="app">
      <div className="score-board">
        <span>Score: </span><b>{score}</b>
      </div>
      <div className="game">
        {candies.map(({ color, modifier }, index) => (
          <div
            key={index}
            className={`img-container ${color !== blank && modifier ? modifier : ''}`}
            data-src={color}
            data-index={index}
            data-modifier={modifier}
            draggable={true}
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
      <audio id="line_blast" src="/sounds/line_blast.ogg" preload="auto"></audio>
      <audio id="striped_candy_created" src="/sounds/striped_candy_created.ogg" preload="auto"></audio>
      <audio id="negative_switch" src="/sounds/negative_switch.ogg" preload="auto"></audio>
      <audio id="match" src="/sounds/new_game.ogg" preload="auto"></audio>
    </div>
  );
};

export default App;

