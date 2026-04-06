'use client'

import { useState } from 'react'
import { ArrowRight, Clock } from 'lucide-react'

export function Round4SystemDesign() {
  const [timeElapsed] = useState(0)

  return (
    <div className="h-screen flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between p-4 border-b">
        <h1 className="font-bold">Round 4: System Design</h1>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {timeElapsed}s
        </div>
      </div>

      <div className="flex flex-1">
        
        {/* Sidebar */}
        <div className="w-72 border-r p-4">
          <h3 className="font-bold">Design Chat App</h3>

          <textarea
            placeholder="Explain your design..."
            className="mt-4 w-full border p-2"
          />

          <button className="mt-4 bg-green-600 text-white px-4 py-2 flex gap-2">
            Submit <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Empty Canvas */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center">
          <p className="text-gray-400">Canvas Coming Soon...</p>
        </div>
      </div>
    </div>
  )
}