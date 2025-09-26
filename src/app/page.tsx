"use client";

import { useEffect, useState } from "react";

const width = 8;
const candyColors = ["red", "blue", "green", "yellow", "orange", "purple"];


export default function Home() {
  const [board, setBoard] = useState<string[]>([]);

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

  console.log(board);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-8">
      <div className="w-[560px] h-[560px] flex flex-wrap gap-2">
        {board.map((candy, index) => (
          <div key={index} className=" w-12 h-12" style={{ backgroundColor: candy }}></div>
        ))}
      </div>
    </div>
  );
}
