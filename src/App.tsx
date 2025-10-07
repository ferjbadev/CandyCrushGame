

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
    <div className="grid grid-cols-3">
      {candies.map((candy, index) => (
        <img key={index} src={candy.color} alt="candy" />
      ))}
    </div>
  )
}

export default App
