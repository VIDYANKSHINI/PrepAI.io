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
    question: 'Which data structure uses LIFO?',
    options: ['Queue', 'Stack', 'Tree', 'Graph'],
    answer: 'Stack',
  },
  {
    type: 'coding',
    question: 'Write a function to check if a number is even.',
    answer: '%2',
  },
  {
    type: 'coding',
    question: 'Return the maximum of two numbers.',
    answer: 'Math.max',
  },
]

export function Round1Aptitude() {
  const { setCurrentRound, updateRoundScore } = useInterview()

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState('')
  const [code, setCode] = useState('')
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(45)
  const [skipped, setSkipped] = useState(0)

  const q = questions[current]

  // ⏱ Timer
  useEffect(() => {
    if (time === 0) handleNext()
    const t = setInterval(() => setTime((p) => p - 1), 1000)
    return () => clearInterval(t)
  }, [time])

  // 👉 Next Question
  const handleNext = () => {
    let newScore = score

    if (q.type === 'mcq' && selected === q.answer) {
      newScore += 10
    }

    if (q.type === 'coding' && code.toLowerCase().includes(q.answer)) {
      newScore += 15
    }

    setScore(newScore)

    if (current < questions.length - 1) {
      setCurrent(current + 1)
      setSelected('')
      setCode('')
      setTime(45)
    } else {
      finish(newScore)
    }
  }

  // ⏭ Skip
  const handleSkip = () => {
    setSkipped(skipped + 1)

    if (current < questions.length - 1) {
      setCurrent(current + 1)
      setSelected('')
      setCode('')
      setTime(45)
    } else {
      finish(score)
    }
  }

  // 🛑 Finish
  const finish = (finalScore: number) => {
    const percentage = (finalScore / 50) * 100

    updateRoundScore('aptitude', {
      score: finalScore,
      maxScore: 50,
      feedback:
        percentage > 70
          ? 'Strong fundamentals'
          : percentage > 40
          ? 'Average performance'
          : 'Needs improvement',
      details: {
        skipped,
        attempted: questions.length - skipped,
      },
    })

    setCurrentRound(2)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Round 1: Aptitude</h1>
        <span>{time}s</span>
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-700 h-2 mb-6">
        <div
          className="bg-blue-500 h-2"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-4">
        <p className="text-lg">{q.question}</p>
      </div>

      {/* MCQ */}
      {q.type === 'mcq' && (
        <div className="flex flex-col gap-3">
          {q.options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className={`p-3 border rounded ${
                selected === opt ? 'bg-blue-500' : 'bg-gray-800'
              }`}
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
          placeholder="Write your code here..."
          className="w-full mt-2 p-3 text-black rounded"
          rows={4}
        />
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSkip}
          className="px-4 py-2 bg-gray-600 rounded"
        >
          Skip
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-2 bg-green-600 rounded"
        >
          {current < questions.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-sm text-gray-400">
        Question {current + 1} of {questions.length}
      </div>
    </div>
  )
}