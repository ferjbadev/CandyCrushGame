

import { useEffect, useState } from 'react'
import './App.css'
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
// import blank from './images/blank.png'

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

  console.log(candies)

  const createBoard = () => {
    const randomCandies = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
      randomCandies.push({color: randomColor})
    }
    setCandies(randomCandies)
  }

  useEffect(() => {
    createBoard()
  }, [])

  return (
    <div className="app flex justify-center  items-center h-screen">
      <div className="game w-[90vw] h-[90vw] bg-amber-500 sm:w-[560px] sm:h-[560px] flex flex-wrap">
        {candies.map((candy, index) => (
          <img 
            key={index} 
            src={candy.color} 
            alt="candy" 
            className='w-[11.25vw] h-[11.25vw] sm:w-[70px] sm:h-[70px]'
          />
        ))}
      </div>
    </div>
  )
}

export default App
