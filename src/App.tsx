

import { useEffect, useRef, useState } from 'react'
import './App.css'
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blank from './images/blank.png'

const width = 8
const candyColors = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
]


function App() {

  const [candies, setCandies] = useState<{color: string}[]>([])
  const currentCandies = useRef<{color: string}[]>([])
  const [score, setScore] = useState(0)

  const checkForColumnsOf = (num: number) => {
    for (let i = 0; i < (width * width - (num - 1) * width); i++) {
      const columns = [];

      for (let j = 0; j < num; j++) {
        columns.push(i + j * width)
      }   
      const decidedColor = currentCandies.current[i].color
      const isBlank = decidedColor === blank

      if(isBlank) continue;

      if(columns.every(index => currentCandies.current[index].color === decidedColor)) {
        for (let j = 0; j < columns.length; j++) {
          currentCandies.current[columns[j]].color = blank
        }
      }
     }
  }

  const checkForRows = (num: number) => {
    for (let i = 0; i < width * width; i++) {
      const rows = [];

      for (let j = 0; j < num; j++) {
        rows.push(i + j)
      }   
      const decidedColor = currentCandies.current[i].color
      const isBlank = decidedColor === blank
      
      if( (width - (i % width) < num) || isBlank) continue; 

      if(rows.every(index => currentCandies.current[index].color === decidedColor)) {
        for (let j = 0; j < rows.length; j++) {
          currentCandies.current[rows[j]].color = blank
        }
      }
     }
  }

  const moveIntoSquare = () => {
    for (let i = 0; i < width * width - width; i++) {
      const isFistRow = i < width;
      const isFirstColumn = (i % width === 0)
      
      if(isFistRow && currentCandies.current[i].color === blank) {
        const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
        currentCandies.current[i].color = randomColor    
      }
      if(currentCandies.current[i + width].color === blank) {
        currentCandies.current[i + width].color = currentCandies.current[i].color
        currentCandies.current[i].color = blank
      }
     }
  }

  const createBoard = () => {
    const randomCandies = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
      randomCandies.push({color: randomColor})
    }
    setCandies(randomCandies)
    currentCandies.current = randomCandies
  }

  useEffect(() => {
    createBoard()

    const timer = setInterval(() => {
      checkForColumnsOf(4)
      checkForRows(4)
      checkForColumnsOf(3)
      checkForRows(3)
      moveIntoSquare()
      setCandies([...currentCandies.current])
    }, 100)

    return () => clearInterval(timer)

  }, [])

  return (
    <div className="app flex justify-center items-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="game w-[90vw] h-[90vw] bg-white/50 sm:w-[560px] sm:h-[560px] flex flex-wrap rounded-lg shadow-lg">
          {candies.map((candy, index) => (
            <img
              key={index}
              src={candy.color}
              alt="candy"
              className='w-[11.25vw] h-[11.25vw] sm:w-[70px] sm:h-[70px]'
            />
          ))}
        </div>
        <div className="bg-white/50 p-3 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-slate-700">Score: {score}</h1>
        </div>
      </div>
    </div>
  )
}

export default App
