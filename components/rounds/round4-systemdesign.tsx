'use client'

import { useState } from 'react'
import { useInterview } from '@/lib/interview-context'
import { PrepLogo } from '../prep-logo'
import { CheckCircle } from 'lucide-react'

const prompt = {
  title: "Design a Real-Time Chat Application",
  description: "Design a scalable chat app like WhatsApp.",
  requirements: [
    "Real-time messaging",
    "Scalable system",
    "Message storage",
  ],
}

export function Round4SystemDesign() {
  const { setCurrentRound, setCurrentStep } = useInterview()

  const [explanation, setExplanation] = useState('')
  const [complete, setComplete] = useState(false)

  const handleSubmit = () => {
    setComplete(true)
  }

  const nextRound = () => {
    setCurrentRound(5)
    setCurrentStep('round5-behavioral')
  }

  if (complete) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
          <h2>Round Complete</h2>

          <button
            onClick={nextRound}
            className="bg-blue-500 px-6 py-2 rounded"
          >
            Next Round →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">

      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1>Round 4: System Design</h1>
      </div>

      <div className="flex flex-1">

        {/* Left */}
        <div className="w-1/2 p-6 border-r border-gray-700">
          <h2>{prompt.title}</h2>
          <p className="mt-2">{prompt.description}</p>

          <ul className="mt-4">
            {prompt.requirements.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </div>

        {/* Right */}
        <div className="w-1/2 p-6 flex flex-col">
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="flex-1 p-4 bg-gray-900"
          />

          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-600 px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}