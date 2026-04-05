'use client'

import { useState, useEffect, useRef } from 'react'

const problem = {
  title: "Reverse a Linked List",
  description: "Given the head of a singly linked list, reverse the list."
}

export function Round3LiveCoding() {
  const [code, setCode] = useState('')
  const [started, setStarted] = useState(false)
  const [time, setTime] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)

  // Timer
  useEffect(() => {
    if (!started) return
    const timer = setInterval(() => {
      setTime((t) => t + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [started])

  // Camera setup
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      
      {/* Header */}
      <div className="p-4 flex justify-between border-b border-gray-700">
        <h1 className="font-bold">Round 3: Live Coding</h1>
        <span>{time}s</span>
      </div>

      {/* Start Button */}
      {!started && (
        <div className="flex flex-1 items-center justify-center">
          <button
            onClick={() => setStarted(true)}
            className="bg-blue-500 px-6 py-2 rounded"
          >
            Start Interview
          </button>
        </div>
      )}

      {/* Main Content */}
      {started && (
        <div className="flex flex-1">
          
          {/* Left Side */}
          <div className="w-1/2 flex flex-col border-r border-gray-700">
            
            {/* Camera */}
            <video
              ref={videoRef}
              autoPlay
              className="h-1/2 w-full object-cover bg-black"
            />

            {/* Problem */}
            <div className="p-4">
              <h2 className="text-lg font-bold">{problem.title}</h2>
              <p className="text-sm mt-2">{problem.description}</p>
            </div>
          </div>

          {/* Right Side - Code Editor */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-1/2 p-4 bg-gray-900 text-white outline-none"
            placeholder="Start coding here..."
          />
        </div>
      )}
    </div>
  )
}