'use client'

import { useState, useRef } from 'react'
import { ArrowRight, Clock } from 'lucide-react'

export function Round4SystemDesign() {
  const [timeElapsed] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [isDrawing, setIsDrawing] = useState(false)
  const [start, setStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: any) => {
    setIsDrawing(true)
    setStart({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
  }

  const handleMouseUp = (e: any) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    const endX = e.nativeEvent.offsetX
    const endY = e.nativeEvent.offsetY

    ctx.strokeStyle = 'white'
    ctx.strokeRect(start.x, start.y, endX - start.x, endY - start.y)

    setIsDrawing(false)
  }

  return (
    <div className="h-screen flex flex-col">

      <div className="flex justify-between p-4 border-b">
        <h1 className="font-bold">Round 4: System Design</h1>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {timeElapsed}s
        </div>
      </div>

      <div className="flex flex-1">
        
        <div className="w-72 border-r p-4">
          <h3 className="font-bold">Design Chat App</h3>

          <textarea className="mt-4 w-full border p-2" />

          <button className="mt-4 bg-green-600 text-white px-4 py-2 flex gap-2">
            Submit <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="bg-black"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />
        </div>
      </div>
    </div>
  )
}