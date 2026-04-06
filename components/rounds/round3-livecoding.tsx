'use client'

import { useState, useEffect, useRef } from 'react'

const problem = {
  title: "Reverse a Linked List",
  description: "Given the head of a singly linked list, reverse the list.",
  hints: [
    "Think about previous and next pointers",
    "Try iterative approach",
    "Keep track of current node"
  ]
}

export function Round3LiveCoding() {
  const [code, setCode] = useState('')
  const [started, setStarted] = useState(false)
  const [time, setTime] = useState(0)
  const [message, setMessage] = useState("Click start to begin")
  const [hintIndex, setHintIndex] = useState(0)
  const [completed, setCompleted] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)

  // Timer
  useEffect(() => {
    if (!started || completed) return
    const timer = setInterval(() => {
      setTime((t) => t + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [started, completed])

  // Camera + Mic
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch((err) => console.error(err))
  }, [])

  // AI Voice
  const speak = (text: string) => {
    setMessage(text)
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(u)
    }
  }

  const startInterview = () => {
    setStarted(true)
    speak("Welcome to live coding round. Please explain your approach.")
  }

  const getHint = () => {
    if (hintIndex < problem.hints.length) {
      speak(problem.hints[hintIndex])
      setHintIndex(hintIndex + 1)
    } else {
      speak("No more hints available")
    }
  }

  const handleSubmit = () => {
    speak("Good job, you completed this round")
    setCompleted(true)
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">

      {/* Header */}
      <div className="p-4 flex justify-between border-b border-gray-700">
        <h1 className="font-bold">Round 3: Live Coding</h1>
        <span>{time}s</span>
      </div>

      {/* Start Screen */}
      {!started && (
        <div className="flex flex-1 items-center justify-center">
          <button
            onClick={startInterview}
            className="bg-blue-500 px-6 py-2 rounded"
          >
            Start Interview
          </button>
        </div>
      )}

      {/* Completed Screen */}
      {completed && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <h2 className="text-xl font-bold">Round Completed ✅</h2>
          <button className="bg-green-500 px-6 py-2 rounded">
            Proceed to Next Round →
          </button>
        </div>
      )}

      {/* Main Content */}
      {started && !completed && (
        <div className="flex flex-1">

          {/* Left */}
          <div className="w-1/2 flex flex-col border-r border-gray-700">

            {/* AI Message */}
            <div className="p-4 border-b border-gray-700">
              <p>{message}</p>
            </div>

            {/* Camera */}
            <video
              ref={videoRef}
              autoPlay
              className="h-1/2 w-full object-cover"
            />

            {/* Problem */}
            <div className="p-4">
              <h2 className="text-lg font-bold">{problem.title}</h2>
              <p className="text-sm mt-2">{problem.description}</p>
            </div>
          </div>

          {/* Right - Editor */}
          <div className="w-1/2 flex flex-col">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 bg-gray-900 outline-none"
              placeholder="Start coding..."
            />

            {/* Controls */}
            <div className="p-4 flex justify-between border-t border-gray-700">
              <button
                onClick={getHint}
                className="bg-yellow-500 px-4 py-2 rounded"
              >
                Hint ({problem.hints.length - hintIndex})
              </button>

              <button
                onClick={handleSubmit}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}