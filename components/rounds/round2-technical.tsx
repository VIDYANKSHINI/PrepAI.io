'use client'
import { useState } from 'react'

const codingProblems = [
  {
    id: 1,
    title: "Two Sum",
    starterCode: `function twoSum(nums, target) {
  
}`,
  },
]

export default function Round2() {
  const [currentProblem] = useState(0)

  return (
    <div>
      <h1>{codingProblems[currentProblem].title}</h1>
    </div>
  )
}