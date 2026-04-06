'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Square, Circle, Minus, Type } from 'lucide-react'

interface Shape {
  id: string
  type: 'rect' | 'circle' | 'arrow' | 'text'
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  text?: string
  endX?: number
  endY?: number
}

export function Round4SystemDesign() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [shapes, setShapes] = useState<Shape[]>([])
  const [tool, setTool] = useState<'rect' | 'circle' | 'arrow' | 'text'>('rect')
  const [isDrawing, setIsDrawing] = useState(false)
  const [start, setStart] = useState({ x: 0, y: 0 })
  const [explanation, setExplanation] = useState('')

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    shapes.forEach((shape) => {
      ctx.strokeStyle = '#38bdf8'
      ctx.fillStyle = '#38bdf820'

      if (shape.type === 'rect' && shape.width && shape.height) {
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
      } else if (shape.type === 'circle' && shape.radius) {
        ctx.beginPath()
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      } else if (shape.type === 'arrow' && shape.endX && shape.endY) {
        ctx.beginPath()
        ctx.moveTo(shape.x, shape.y)
        ctx.lineTo(shape.endX, shape.endY)
        ctx.stroke()
      } else if (shape.type === 'text' && shape.text) {
        ctx.fillStyle = '#fff'
        ctx.fillText(shape.text, shape.x, shape.y)
      }
    })
  }, [shapes])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    setStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDrawing(true)

    if (tool === 'text') {
      const text = prompt('Enter text')
      if (text) {
        setShapes([...shapes, {
          id: Date.now().toString(),
          type: 'text',
          x: start.x,
          y: start.y,
          text,
        }])
      }
      setIsDrawing(false)
    }
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    setIsDrawing(false)

    const rect = canvasRef.current!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    let newShape: Shape | null = null

    if (tool === 'rect') {
      newShape = {
        id: Date.now().toString(),
        type: 'rect',
        x: start.x,
        y: start.y,
        width: x - start.x,
        height: y - start.y,
      }
    }

    if (tool === 'circle') {
      const radius = Math.sqrt((x - start.x) ** 2 + (y - start.y) ** 2)
      newShape = {
        id: Date.now().toString(),
        type: 'circle',
        x: start.x,
        y: start.y,
        radius,
      }
    }

    if (tool === 'arrow') {
      newShape = {
        id: Date.now().toString(),
        type: 'arrow',
        x: start.x,
        y: start.y,
        endX: x,
        endY: y,
      }
    }

    if (newShape) {
      setShapes([...shapes, newShape])
    }
  }

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-64 border-r p-4">
        <h2 className="font-bold">System Design</h2>

        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explain your design..."
          className="mt-4 w-full border p-2"
        />
      </div>

      {/* Canvas Area */}
      <div className="flex flex-1 flex-col">

        {/* Toolbar */}
        <div className="flex gap-2 p-2 border-b">
          <button onClick={() => setTool('rect')}>
            <Square />
          </button>
          <button onClick={() => setTool('circle')}>
            <Circle />
          </button>
          <button onClick={() => setTool('arrow')}>
            <Minus />
          </button>
          <button onClick={() => setTool('text')}>
            <Type />
          </button>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="flex-1 bg-black"
          width={900}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      </div>
    </div>
  )
}