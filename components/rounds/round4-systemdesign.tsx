'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowRight, Clock } from 'lucide-react'

export function Round4SystemDesign() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [shapes, setShapes] = useState<any[]>([])
  const [start, setStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: any) => {
    setStart({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
  }

  const handleMouseUp = (e: any) => {
    const endX = e.nativeEvent.offsetX
    const endY = e.nativeEvent.offsetY

    setShapes([...shapes, {
      x: start.x,
      y: start.y,
      w: endX - start.x,
      h: endY - start.y
    }])
  }

  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, 800, 500)

    shapes.forEach(s => {
      ctx.strokeStyle = 'white'
      ctx.strokeRect(s.x, s.y, s.w, s.h)
    })
  }

  useEffect(() => {
    draw()
  }, [shapes])

  return (
    <div className="h-screen flex">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="bg-black"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  )
}