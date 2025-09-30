"use client";

import { useEffect, useState, useCallback } from "react";

const width = 8;
const candyColors = ["red", "violet", "green", "yellow", "orange", "purple"];


export default function Home() {
  const [board, setBoard] = useState<string[]>([]);
  const [candyBeingDraggedId, setCandyBeingDraggedId] = useState<number | null>(null);
  const [candyBeingReplacedId, setCandyBeingReplacedId] = useState<number | null>(null);
 
  const checkForColumnOfFour = useCallback(() => {
    for (let i = 0; i < 39;  i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = board[i];

      if (columnOfFour.every(index => board[index] === decidedColor)) {
        columnOfFour.forEach(index => board[index] = '');
      }    
    }
  }, [board]);

  const checkForColumnOfThree = useCallback(() => {
    for (let i = 0; i < 47;  i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = board[i];

      if (columnOfThree.every(index => board[index] === decidedColor)) {
        columnOfThree.forEach(index => board[index] = '');
      }    
    }
  }, [board]);

  const checkForRowOfThree = useCallback(() => {
    for (let i = 0; i < 64;  i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = board[i];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];

      if (notValid.includes(i)) continue

      if (rowOfThree.every(index => board[index] === decidedColor)) {
        rowOfThree.forEach(index => board[index] = '');
      }    
    }
  }, [board]);

  const checkForRowOfFour = useCallback(() => {
    for (let i = 0; i < 64;  i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = board[i];
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64];

      if (notValid.includes(i)) continue

      if (rowOfFour.every(index => board[index] === decidedColor)) {
        rowOfFour.forEach(index => board[index] = '');
      }    
    }
  }, [board]);

  const moveIntoSquareBelow = useCallback(() => {
    for (let i = 0; i < 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && board[i] === '') {
        const randomNumber = Math.floor(Math.random() * candyColors.length);
        board[i] = candyColors[randomNumber];
      }

      if (board[i + width] === '') {
        board[i + width] = board[i];
        board[i] = '';
      }
    }
  }, [board]);

  const dragStart = (e: React.DragEvent<HTMLElement>) => {
    console.log('drag start');
    setCandyBeingDraggedId(parseInt(e.currentTarget.dataset.id!));
  }
  const dragDrop = (e: React.DragEvent<HTMLElement>) => {
    console.log('drag drop');
    setCandyBeingReplacedId(parseInt(e.currentTarget.dataset.id!));
  }
  const dragEnd = (e: React.DragEvent<HTMLElement>) => {
    console.log('drag end');
  }

  const createBoard = () => {
    const board: string[] = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      board.push(randomColor);
    }
    setBoard(board);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      checkForRowOfFour();
      moveIntoSquareBelow();
      setBoard([...board]);
    }, 100);

    return () => clearInterval(timer);
  }, [checkForColumnOfFour, checkForColumnOfThree, checkForRowOfThree, checkForRowOfFour, moveIntoSquareBelow, board]);

  console.log(board);

  return (  
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-[560px] h-[560px] flex flex-wrap gap-2 ">
        {board.map((candy, index) => (
          <div key={index} className="w-14 h-14 flex items-center justify-center text-black font-bold text-xs" style={{ backgroundColor: candy }}
          data-id={index}
          draggable={true}
          onDragStart={dragStart}
          onDragOver={(e: React.DragEvent<HTMLElement>) => e.preventDefault()}
          onDragEnter={(e: React.DragEvent<HTMLElement>) => e.preventDefault()}
          onDragLeave={(e: React.DragEvent<HTMLElement>) => e.preventDefault()}
          onDrop={dragDrop}
          onDragEnd={dragEnd}
          >
            {candy}
          </div>
        ))}
      </div>
    </div>
  );
}
