'use client'

import { useState } from 'react'
import { PrepLogo } from '../prep-logo'
import { Clock } from 'lucide-react'

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
  const [time, setTime] = useState(0)
  const [explanation, setExplanation] = useState('')

  // Timer
  useState(() => {
    const t = setInterval(() => setTime((t) => t + 1), 1000)
    return () => clearInterval(t)
  })

  return (
    <div className="h-screen flex flex-col bg-black text-white">

      {/* Header */}
      <div className="p-4 flex justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <PrepLogo className="h-6 w-6" />
          <h1>Round 4: System Design</h1>
        </div>
        <span>{time}s</span>
      </div>

      {/* Content */}
      <div className="flex flex-1">

        {/* Left */}
        <div className="w-1/2 p-6 border-r border-gray-700">
          <h2 className="text-lg font-bold">{prompt.title}</h2>
          <p className="mt-2 text-sm">{prompt.description}</p>

          <ul className="mt-4 text-sm">
            {prompt.requirements.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </div>

        {/* Right */}
        <div className="w-1/2 p-6">
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Explain your design..."
            className="w-full h-full p-4 bg-gray-900 outline-none"
          />
        </div>
      </div>
    </div>
  )
}