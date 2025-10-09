import React, { useEffect, useRef, useState } from 'react';
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
  yellowCandy
];

const App: React.FC = () => {
  const [candies, setCandies] = useState<Candy[]>([]);
  const currentCandies = useRef<Candy[]>([]);
  const [candieDragged, setCandieDragged] = useState<HTMLDivElement | null>(null);
  const [candieToReplace, setCandieToReplace] = useState<HTMLDivElement | null>(null);
  const [score, setScore] = useState<number>(0);

  const playSound = (id: string) => {
    const audioElement = document.getElementById(id) as HTMLAudioElement;
    if (audioElement) {
      audioElement.currentTime = 0;
      audioElement.play().catch(error => console.log('Error playing sound:', error));
    }
  };

  const updateScore = (num: number) => {
    setScore(prevScore => prevScore + num);
  };

  const animateRow = (row: number) => {
    const elem = document.createElement('div');
    elem.classList.add('animate');
    elem.style.left = '0';
    elem.style.top = `${row * 70 + 35 + 20}px`;
    elem.style.width = '0';
    elem.style.height = '5px';

    const gameElement = document.querySelector('.game');
    if (gameElement) {
      gameElement.appendChild(elem);

      setTimeout(() => {
        elem.classList.add('animateRow');

        setTimeout(() => {
          elem.remove();
        }, 100);
      }, 100);
    }
  };

  const animateCol = (col: number) => {
    const elem = document.createElement('div');
    elem.classList.add('animate');
    elem.style.top = '0';
    elem.style.left = `${col * 70 + 35 + 20}px`;
    elem.style.height = '0';
    elem.style.width = '5px';

    const gameElement = document.querySelector('.game');
    if (gameElement) {
      gameElement.appendChild(elem);

      setTimeout(() => {
        elem.classList.add('animateCol');

        setTimeout(() => {
          elem.remove();
        }, 100);
      }, 100);
    }
  };

  const setRowToBlank = (index: number) => {
    const row = Math.floor(index / WIDTH);
    const start = row * WIDTH;
    const end = start + WIDTH;

    for (let i = start; i < end; i++) {
      if (i >= 0 && i < currentCandies.current.length) {
        currentCandies.current[i] = {
          ...currentCandies.current[i],
          color: blank,
          modifier: ''
        };
      }
    }
        updateScore(WIDTH)
        animateRow(row)
        playSound('line_blast')
    }

  const setColToBlank = (index: number): void => {
    const col = index % WIDTH;
    
    for (let i = 0; i < WIDTH; i++) {
      const currentIndex = col + i * WIDTH;
      if (currentIndex >= 0 && currentIndex < currentCandies.current.length) {
        currentCandies.current[currentIndex] = {
          ...currentCandies.current[currentIndex],
          color: blank,
          modifier: ''
        };
      }
    }
    
    updateScore(WIDTH);
    animateCol(col);
    playSound('line_blast');
  };

  const moveIntoSquareBelow = (): boolean => {
    let moved = false;
    for (let i = 0; i < (WIDTH * WIDTH - WIDTH); i++) {
      const isFirstRow = i < WIDTH;

      if (isFirstRow && currentCandies.current[i].color === blank) {
        const randomNumber = Math.floor(Math.random() * candyColors.length);
        currentCandies.current[i].color = candyColors[randomNumber];
        currentCandies.current[i].modifier = '';
        moved = true;
      }

      if ((currentCandies.current[i + WIDTH].color) === blank) {
        currentCandies.current[i + WIDTH].color = currentCandies.current[i].color;
        currentCandies.current[i + WIDTH].modifier = currentCandies.current[i].modifier;
        currentCandies.current[i].color = blank;
        currentCandies.current[i].modifier = '';
        moved = true;
      }
    }
    return moved;
  };

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setCandieDragged(e.currentTarget);
  };

  const dragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setCandieToReplace(e.currentTarget);
  };

  const dragEnd = () => {
    if (!candieDragged || !candieToReplace) return;
    
    const candieDraggedIndex = parseInt(candieDragged.getAttribute('data-index') ?? '0', 10);
    const candieToReplaceIndex = parseInt(candieToReplace.getAttribute('data-index') ?? '0', 10);

    const validMoves = [
      candieDraggedIndex - 1,
      candieDraggedIndex - WIDTH,
      candieDraggedIndex + 1,
      candieDraggedIndex + WIDTH
    ].filter(index => index >= 0 && index < WIDTH * WIDTH);

    const validMove = validMoves.includes(candieToReplaceIndex);
    if (!validMove) return;

    // Check for two modified candies
    if (currentCandies.current[candieToReplaceIndex]?.modifier && 
        currentCandies.current[candieDraggedIndex]?.modifier) {
      setRowToBlank(candieToReplaceIndex);
      setColToBlank(candieToReplaceIndex);
      setCandieDragged(null);
      setCandieToReplace(null);
      return;
    }

    // Get attributes with null checks
    const draggedSrc = candieDragged.getAttribute('data-src') || '';
    const draggedModifier = candieDragged.getAttribute('data-modifier') || undefined;
    const replaceSrc = candieToReplace.getAttribute('data-src') || '';
    const replaceModifier = candieToReplace.getAttribute('data-modifier') || undefined;

    // Create a new array to avoid direct state mutation
    const newCandies = [...currentCandies.current];
    
    // Swap candies
    newCandies[candieToReplaceIndex] = {
      ...newCandies[candieToReplaceIndex],
      color: draggedSrc,
      modifier: draggedModifier || undefined
    };
    
    newCandies[candieDraggedIndex] = {
      ...newCandies[candieDraggedIndex],
      color: replaceSrc,
      modifier: replaceModifier || undefined
    };

    // Update the ref with the new state
    currentCandies.current = newCandies;

    // Check for matches
    const isAColumnOfFour = checkForColumns(4, [candieToReplaceIndex, candieDraggedIndex]);
    const isARowOfFour = checkForRows(4, [candieToReplaceIndex, candieDraggedIndex]);
    const isAColumnOfThree = checkForColumns(3, [candieToReplaceIndex, candieDraggedIndex]);
    const isARowOfThree = checkForRows(3, [candieToReplaceIndex, candieDraggedIndex]);

    const isValidMove = isAColumnOfFour || isARowOfFour || isAColumnOfThree || isARowOfThree;

    if (isValidMove) {
      setCandies([...newCandies]);
    } else {
      // Revert the swap if no matches
      const revertedCandies = [...newCandies];
      revertedCandies[candieToReplaceIndex] = {
        ...revertedCandies[candieToReplaceIndex],
        color: replaceSrc,
        modifier: replaceModifier || undefined
      };
      revertedCandies[candieDraggedIndex] = {
        ...revertedCandies[candieDraggedIndex],
        color: draggedSrc,
        modifier: draggedModifier || undefined
      };
      currentCandies.current = revertedCandies;
      playSound('negative_switch');
    }

    // Reset drag states
    setCandieDragged(null);
    setCandieToReplace(null);
    }


  const createBoard = () => {
    const randomCandies: Candy[] = [];
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      randomCandies.push({
        color: randomColor,
        modifier: ''
      });
    }
    setCandies(randomCandies);
    currentCandies.current = [...randomCandies];
  };

  const checkForColumns = (count: number, excludeIndices: number[] = []): boolean => {
    let matched = false;
    for (let i = 0; i < WIDTH * WIDTH - (WIDTH * (count - 1)); i++) {
      const column: number[] = [i];
      const color = currentCandies.current[i]?.color;
      if (color === blank) continue;

      for (let j = 1; j < count; j++) {
        const nextIndex = i + j * WIDTH;
        if (nextIndex >= WIDTH * WIDTH) break;
        if (currentCandies.current[nextIndex]?.color === color) {
          column.push(nextIndex);
        } else {
          break;
        }
      }

      if (column.length >= count) {
        const hasExcludedIndex = column.some(index => excludeIndices.includes(index));
        if (hasExcludedIndex) return true;

        column.forEach(index => {
          currentCandies.current[index].color = blank;
          currentCandies.current[index].modifier = '';
        });
        setScore(prev => prev + column.length * 10);
        playSound('match');
        matched = true;
      }
    }
    return matched;
  };

  const checkForRows = (count: number, excludeIndices: number[] = []): boolean => {
    let matched = false;
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      if (i % WIDTH > WIDTH - count) continue;
      
      const row: number[] = [i];
      const color = currentCandies.current[i]?.color;
      if (color === blank) continue;

      for (let j = 1; j < count; j++) {
        const nextIndex = i + j;
        if (Math.floor(nextIndex / WIDTH) !== Math.floor(i / WIDTH)) break;
        if (currentCandies.current[nextIndex]?.color === color) {
          row.push(nextIndex);
        } else {
          break;
        }
      }

      if (row.length >= count) {
        const hasExcludedIndex = row.some(index => excludeIndices.includes(index));
        if (hasExcludedIndex) return true;

        row.forEach(index => {
          currentCandies.current[index].color = blank;
          currentCandies.current[index].modifier = '';
        });
        setScore(prev => prev + row.length * 10);
        playSound('match');
        matched = true;
      }
    }
    return matched;
  };

  const checkForMatches = (): boolean => {
    let changed = false;
    if (checkForColumns(4)) changed = true;
    if (checkForRows(4)) changed = true;
    if (checkForColumns(3)) changed = true;
    if (checkForRows(3)) changed = true;
    return changed;
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const matchesFound = checkForMatches();
      const moved = moveIntoSquareBelow();
      if (matchesFound || moved) {
        setCandies([...currentCandies.current]);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, []);


  return (
    <div className="app">
      <div className="score-board">
        <span>Score: </span><b>{score}</b>
      </div>
      <div className="game">
        {candies.map(({ color, modifier = '' }, index) => (
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
            <img
              src={color}
              alt={`candy-${index}`}
              draggable={false}
            />
          </div>
        ))}
      </div>
      {/* Audio elements for sound effects */}
      <audio id="line_blast" src="/sounds/line_blast.mp3" preload="auto"></audio>
      <audio id="striped_candy_created" src="/sounds/striped_candy_created.mp3" preload="auto"></audio>
      <audio id="negative_switch" src="/sounds/negative_switch.mp3" preload="auto"></audio>
    </div>
  )
}

export default App
