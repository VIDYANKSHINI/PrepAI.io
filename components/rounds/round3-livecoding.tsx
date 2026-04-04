'use client'

import { useState, useEffect } from 'react'

export function Round3LiveCoding() {
  const [started, setStarted] = useState(false)
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (!started) return
    const t = setInterval(() => setTime((t) => t + 1), 1000)
    return () => clearInterval(t)
  }, [started])

  return (
    <div className="h-screen flex flex-col text-white bg-black">
      <div className="p-4 flex justify-between">
        <h1>Live Coding</h1>
        <span>{time}s</span>
      </div>

      {!started && (
        <button
          onClick={() => setStarted(true)}
          className="m-auto bg-blue-500 px-6 py-2"
        >
          Start
        </button>
      )}
    </div>
  )
}