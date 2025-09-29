"use client";

import { useEffect, useState } from "react";

const width = 8;
const candyColors = ["red", "violet", "green", "yellow", "orange", "purple"];


export default function Home() {
  const [board, setBoard] = useState<string[]>([]);

  const checkForColumnOfFour = () => {
    for (let i = 0; i < 39;  i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = board[i];

      if (columnOfFour.every(index => board[index] === decidedColor)) {
        columnOfFour.forEach(index => board[index] = '');
      }    
    }
  };

  const checkForColumnOfThree = () => {
    for (let i = 0; i < 47;  i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = board[i];

      if (columnOfThree.every(index => board[index] === decidedColor)) {
        columnOfThree.forEach(index => board[index] = '');
      }    
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64;  i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = board[i];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];

      if (notValid.includes(i)) continue

      if (rowOfThree.every(index => board[index] === decidedColor)) {
        rowOfThree.forEach(index => board[index] = '');
      }    
    }
  };

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
      setBoard([...board]);
    }, 100);

    return () => clearInterval(timer);
  }, [checkForColumnOfFour, checkForColumnOfThree, checkForRowOfThree, board]);

  console.log(board);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-[560px] h-[560px] flex flex-wrap gap-2 ">
        {board.map((candy, index) => (
          <div key={index} className="w-14 h-14 flex items-center justify-center text-black font-bold text-xs" style={{ backgroundColor: candy }}>
            {candy}
          </div>
        ))}
      </div>
    </div>
  );
}
