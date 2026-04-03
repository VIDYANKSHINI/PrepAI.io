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
  const [code, setCode] = useState(codingProblems[0].starterCode)

  return (
    <div>
      <h1>{codingProblems[currentProblem].title}</h1>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: "100%", height: "200px" }}
      />
    </div>
  )
}