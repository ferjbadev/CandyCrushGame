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
    <div >
      {board.map((candy, index) => (
        <div key={index} className="candy" style={{ backgroundColor: candy }}></div>
      ))}
    </div>
  );
}
