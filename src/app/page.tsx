"use client";

import { useEffect, useState } from "react";

const width = 8;
const candyColors = ["red", "blue", "green", "yellow", "orange", "purple"];


export default function Home() {
  const [board, setBoard] = useState<string[]>([]);

  const checkForColumnOfThree = () => {
    const newBoard = [...board];
    for (let i = 0; i < width * width; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = board[i];

      if (columnOfThree.every(index => board[index] === decidedColor)) {
        columnOfThree.forEach(index => newBoard[index] = '');
      }    
    }
    setBoard(newBoard);
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
      checkForColumnOfThree();
      setBoard([...board]);
    }, 100);

    return () => clearInterval(timer);
  }, [checkForColumnOfThree]);

  console.log(board);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-[560px] h-[560px] flex flex-wrap gap-2 ">
        {board.map((candy, index) => (
          <div key={index} className=" w-14 h-14" style={{ backgroundColor: candy }}></div>
        ))}
      </div>
    </div>
  );
}
