'use client'

import { useState, useEffect } from 'react'
import { useInterview } from '@/lib/interview-context'

const questions = [
  {
    type: 'mcq',
    question: 'What is the output of 2 + "2" in JavaScript?',
    options: ['4', '22', 'Error', 'NaN'],
    answer: '22',
  },
  {
    type: 'mcq',
    question: 'Which data structure uses FIFO?',
    options: ['Stack', 'Queue', 'Tree', 'Graph'],
    answer: 'Queue',
  },
  {
    type: 'coding',
    question: 'Write a function to return sum of two numbers.',
    answer: 'a+b',
  },
]

export function Round1Aptitude() {
  const { setCurrentRound, updateRoundScore } = useInterview()

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState('')
  const [code, setCode] = useState('')
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(60)

  const q = questions[current]

  // ⏱ Timer
  useEffect(() => {
    if (time === 0) handleNext()
    const t = setInterval(() => setTime((p) => p - 1), 1000)
    return () => clearInterval(t)
  }, [time])

  // 👉 Next
  const handleNext = () => {
    let newScore = score

    if (q.type === 'mcq' && selected === q.answer) {
      newScore += 10
    }

    if (q.type === 'coding' && code.includes(q.answer)) {
      newScore += 20
    }

    setScore(newScore)

    if (current < questions.length - 1) {
      setCurrent(current + 1)
      setSelected('')
      setCode('')
      setTime(60)
    } else {
      finish(newScore)
    }
  }

  // 🛑 Finish
  const finish = (finalScore: number) => {
    updateRoundScore('aptitude', {
      score: finalScore,
      maxScore: 40,
      feedback: finalScore > 20 ? 'Good basics' : 'Need improvement',
    })

    setCurrentRound(2)
  }

  return (
    <div className="p-6 text-white bg-black min-h-screen">

      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1>Round 1: Aptitude</h1>
        <span>{time}s</span>
      </div>

      {/* Question */}
      <div className="mb-4">
        <p>{q.question}</p>
      </div>

      {/* MCQ */}
      {q.type === 'mcq' && (
        <div className="flex flex-col gap-2">
          {q.options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className={`p-2 border ${selected === opt ? 'bg-blue-500' : ''}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Coding */}
      {q.type === 'coding' && (
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write code..."
          className="w-full p-2 text-black"
        />
      )}

      {/* Next */}
      <button
        onClick={handleNext}
        className="mt-4 px-4 py-2 bg-green-600"
      >
        Next
      </button>
    </div>
  )
}