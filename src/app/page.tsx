"use client";

import Image from 'next/image';
import { useEffect, useState, useCallback } from "react";

const width = 8;
const candyImages = [
  "https://cdn-icons-png.flaticon.com/512/2821/2821720.png", // Red
  "https://cdn-icons-png.flaticon.com/512/2821/2821723.png", // Violet
  "https://cdn-icons-png.flaticon.com/512/2821/2821721.png", // Green
  "https://cdn-icons-png.flaticon.com/512/2821/2821724.png", // Yellow
  "https://cdn-icons-png.flaticon.com/512/2821/2821722.png", // Orange
  "https://cdn-icons-png.flaticon.com/512/2821/2821725.png"  // Purple
];


export default function Home() {
  const [board, setBoard] = useState<string[]>([]);
  const [candyBeingDraggedId, setCandyBeingDraggedId] = useState<number | null>(null);
  const [candyBeingReplacedId, setCandyBeingReplacedId] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const checkForColumnOfFour = useCallback(() => {
    for (let i = 0; i < 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = board[i];
      const isBlank = board[i] === '';

      if (columnOfFour.every(index => board[index] === decidedColor && !isBlank)) {
        columnOfFour.forEach(index => (board[index] = ''));
        setScore((score) => score + 4);
        return true;
      }
    }
    return false;
  }, [board]);

  const checkForColumnOfThree = useCallback(() => {
    for (let i = 0; i < 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = board[i];
      const isBlank = board[i] === '';

      if (columnOfThree.every(index => board[index] === decidedColor && !isBlank)) {
        columnOfThree.forEach(index => (board[index] = ''));
        setScore((score) => score + 3);
        return true;
      }
    }
    return false;
  }, [board]);

  const checkForRowOfThree = useCallback(() => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = board[i];
      const isBlank = board[i] === '';
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];

      if (notValid.includes(i)) continue;

      if (rowOfThree.every(index => board[index] === decidedColor && !isBlank)) {
        rowOfThree.forEach(index => (board[index] = ''));
        setScore((score) => score + 3);
        return true;
      }
    }
    return false;
  }, [board]);

  const checkForRowOfFour = useCallback(() => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = board[i];
      const isBlank = board[i] === '';
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64];

      if (notValid.includes(i)) continue;

      if (rowOfFour.every(index => board[index] === decidedColor && !isBlank)) {
        rowOfFour.forEach(index => (board[index] = ''));
        setScore((score) => score + 4);
        return true;
      }
    }
    return false;
  }, [board]);

  const moveIntoSquareBelow = useCallback(() => {
    for (let i = 0; i < 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && board[i] === '') {
        const randomNumber = Math.floor(Math.random() * candyImages.length);
        board[i] = candyImages[randomNumber];
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
  const dragEnd = () => {
    if (candyBeingDraggedId === null || candyBeingReplacedId === null) return;

    const validMoves = [
      candyBeingDraggedId - 1,
      candyBeingDraggedId - width,
      candyBeingDraggedId + 1,
      candyBeingDraggedId + width
    ];

    const validMove = validMoves.includes(candyBeingReplacedId);

    if (validMove) {
      const newBoard = [...board];
      const candyBeingDragged = newBoard[candyBeingDraggedId];
      newBoard[candyBeingDraggedId] = newBoard[candyBeingReplacedId];
      newBoard[candyBeingReplacedId] = candyBeingDragged;
      setBoard(newBoard);
    } 

    setCandyBeingDraggedId(null);
    setCandyBeingReplacedId(null);
  };

  const createBoard = () => {
    const board: string[] = [];
    for (let i = 0; i < width * width; i++) {
      const randomImage = candyImages[Math.floor(Math.random() * candyImages.length)];
      board.push(randomImage);
    }
    setBoard(board);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    if (board.length === 0) return;

    const timeout = setTimeout(() => {
      const newBoard = [...board];
      checkForColumnOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      checkForRowOfFour();
      moveIntoSquareBelow();
      setBoard(newBoard);
    }, 100);

    return () => clearTimeout(timeout);
  }, [board, checkForColumnOfFour, checkForColumnOfThree, checkForRowOfThree, checkForRowOfFour, moveIntoSquareBelow]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-white tracking-wider">Score</h1>
          <p className="text-5xl font-bold text-white mt-2">{score}</p>
        </div>
        <div className="w-[480px] h-[480px] flex flex-wrap">
          {board.map((candyImage, index) => (
            <div key={index} className="w-[60px] h-[60px] p-1">
              <Image
                src={candyImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'} // Transparent pixel if empty
                alt="candy"
                width={60}
                height={60}
                className="w-full h-full object-contain"
                data-id={index}
                draggable={true}
                onDragStart={dragStart}
                onDragOver={(e: React.DragEvent<HTMLImageElement>) => e.preventDefault()}
                onDragEnter={(e: React.DragEvent<HTMLImageElement>) => e.preventDefault()}
                onDragLeave={(e: React.DragEvent<HTMLImageElement>) => e.preventDefault()}
                onDrop={dragDrop}
                onDragEnd={dragEnd}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
