'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useInterview } from '@/lib/interview-context'
import { RoundProgress } from '../round-progress'
import { PrepLogo } from '../prep-logo'
import { 
  Square, Circle, ArrowRight, Trash2, Undo, Type, 
  CheckCircle, Clock, MousePointer, Minus
} from 'lucide-react'

const systemDesignPrompts = [
  {
    title: "Design a Real-Time Chat Application",
    description: "Design a scalable chat application like WhatsApp or Slack that supports one-on-one messaging, group chats, and real-time notifications.",
    requirements: [
      "Support millions of concurrent users",
      "Real-time message delivery",
      "Message persistence and history",
      "Read receipts and typing indicators",
      "Group chat functionality",
    ],
  },
  {
    title: "Design a URL Shortener",
    description: "Design a URL shortening service like bit.ly that can handle high traffic and provide analytics.",
    requirements: [
      "Generate unique short URLs",
      "Handle 100M+ URLs",
      "Low latency redirects",
      "Analytics for click tracking",
      "Custom URL aliases",
    ],
  },
]

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
  color: string
}

export function Round4SystemDesign() {
  const { setCurrentStep, setCurrentRound, updateRoundScore } = useInterview()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [prompt] = useState(systemDesignPrompts[0])
  const [shapes, setShapes] = useState<Shape[]>([])
  const [selectedTool, setSelectedTool] = useState<'select' | 'rect' | 'circle' | 'arrow' | 'text'>('select')
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 })
  const [explanation, setExplanation] = useState('')
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [history, setHistory] = useState<Shape[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Timer
  useEffect(() => {
    if (isComplete) return
    const timer = setInterval(() => setTimeElapsed((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [isComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#1e1e2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#2d2d3d'
    ctx.lineWidth = 1
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw shapes
    shapes.forEach((shape) => {
      ctx.strokeStyle = shape.color
      ctx.fillStyle = shape.color + '20'
      ctx.lineWidth = shape.id === selectedShape ? 3 : 2

      if (shape.type === 'rect' && shape.width && shape.height) {
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
      } else if (shape.type === 'circle' && shape.radius) {
        ctx.beginPath()
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      } else if (shape.type === 'arrow' && shape.endX !== undefined && shape.endY !== undefined) {
        ctx.beginPath()
        ctx.moveTo(shape.x, shape.y)
        ctx.lineTo(shape.endX, shape.endY)
        ctx.stroke()
        
        // Arrow head
        const angle = Math.atan2(shape.endY - shape.y, shape.endX - shape.x)
        ctx.beginPath()
        ctx.moveTo(shape.endX, shape.endY)
        ctx.lineTo(
          shape.endX - 15 * Math.cos(angle - Math.PI / 6),
          shape.endY - 15 * Math.sin(angle - Math.PI / 6)
        )
        ctx.moveTo(shape.endX, shape.endY)
        ctx.lineTo(
          shape.endX - 15 * Math.cos(angle + Math.PI / 6),
          shape.endY - 15 * Math.sin(angle + Math.PI / 6)
        )
        ctx.stroke()
      } else if (shape.type === 'text' && shape.text) {
        ctx.font = '14px sans-serif'
        ctx.fillStyle = shape.color
        ctx.fillText(shape.text, shape.x, shape.y)
      }
    })
  }, [shapes, selectedShape])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return
    
    canvas.width = parent.clientWidth
    canvas.height = parent.clientHeight
    drawCanvas()
  }, [drawCanvas])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (selectedTool === 'select') {
      // Find clicked shape
      const clicked = [...shapes].reverse().find((shape) => {
        if (shape.type === 'rect' && shape.width && shape.height) {
          return x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height
        }
        if (shape.type === 'circle' && shape.radius) {
          const dist = Math.sqrt((x - shape.x) ** 2 + (y - shape.y) ** 2)
          return dist <= shape.radius
        }
        return false
      })
      setSelectedShape(clicked?.id || null)
    } else {
      setIsDrawing(true)
      setDrawStart({ x, y })

      if (selectedTool === 'text') {
        const text = prompt('Enter text:')
        if (text) {
          addShape({
            id: `shape-${Date.now()}`,
            type: 'text',
            x,
            y,
            text,
            color: '#38bdf8',
          })
        }
        setIsDrawing(false)
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Preview drawing - rerender canvas with temp shape
    drawCanvas()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = '#38bdf8'
    ctx.fillStyle = '#38bdf820'
    ctx.lineWidth = 2

    if (selectedTool === 'rect') {
      const width = x - drawStart.x
      const height = y - drawStart.y
      ctx.fillRect(drawStart.x, drawStart.y, width, height)
      ctx.strokeRect(drawStart.x, drawStart.y, width, height)
    } else if (selectedTool === 'circle') {
      const radius = Math.sqrt((x - drawStart.x) ** 2 + (y - drawStart.y) ** 2)
      ctx.beginPath()
      ctx.arc(drawStart.x, drawStart.y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    } else if (selectedTool === 'arrow') {
      ctx.beginPath()
      ctx.moveTo(drawStart.x, drawStart.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    setIsDrawing(false)

    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const colors = ['#38bdf8', '#22c55e', '#f59e0b', '#ef4444', '#a855f7']
    const color = colors[shapes.length % colors.length]

    if (selectedTool === 'rect') {
      addShape({
        id: `shape-${Date.now()}`,
        type: 'rect',
        x: Math.min(drawStart.x, x),
        y: Math.min(drawStart.y, y),
        width: Math.abs(x - drawStart.x),
        height: Math.abs(y - drawStart.y),
        color,
      })
    } else if (selectedTool === 'circle') {
      const radius = Math.sqrt((x - drawStart.x) ** 2 + (y - drawStart.y) ** 2)
      addShape({
        id: `shape-${Date.now()}`,
        type: 'circle',
        x: drawStart.x,
        y: drawStart.y,
        radius,
        color,
      })
    } else if (selectedTool === 'arrow') {
      addShape({
        id: `shape-${Date.now()}`,
        type: 'arrow',
        x: drawStart.x,
        y: drawStart.y,
        endX: x,
        endY: y,
        color,
      })
    }
  }

  const addShape = (shape: Shape) => {
    const newShapes = [...shapes, shape]
    setShapes(newShapes)
    
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newShapes)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setShapes(history[historyIndex - 1])
    }
  }

  const deleteSelected = () => {
    if (selectedShape) {
      const newShapes = shapes.filter((s) => s.id !== selectedShape)
      setShapes(newShapes)
      setSelectedShape(null)
      
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newShapes)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }

  const handleSubmit = () => {
    const score = Math.min(100, 50 + shapes.length * 5 + (explanation.length > 100 ? 30 : explanation.length / 5))
    
    updateRoundScore('systemDesign', {
      score,
      maxScore: 100,
      feedback: shapes.length > 3 
        ? "Good system design with clear component architecture."
        : "Consider adding more components to show the full system architecture.",
      details: {
        componentsDrawn: shapes.length,
        explanationLength: explanation.length,
        timeSpent: timeElapsed / 60,
      },
    })
    
    setIsComplete(true)
  }

  const proceedToNextRound = () => {
    setCurrentRound(5)
    setCurrentStep('round5-behavioral')
  }

  if (isComplete) {
    return (
      <div className="screen-container relative flex items-center justify-center bg-background">
        <div className="content-container">
          <div className="mx-auto max-w-lg space-y-6 rounded-xl border border-border bg-card p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Round 4 Complete!</h2>
              <p className="mt-2 text-muted-foreground">
                You&apos;ve completed the system design round.
              </p>
            </div>
            <button
              onClick={proceedToNextRound}
              className="mx-auto flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground hover:brightness-110"
            >
              Proceed to Round 5: Behavioral
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="screen-container relative bg-background">
      <div className="flex h-screen flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <PrepLogo className="h-8 w-8" />
              <div>
                <h1 className="font-bold text-foreground">Round 4: System Design</h1>
                <p className="text-xs text-muted-foreground">{prompt.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
              <Clock className="h-4 w-4" />
              <span className="font-mono font-bold">{formatTime(timeElapsed)}</span>
            </div>
          </div>
          <div className="mt-3">
            <RoundProgress />
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar - Requirements */}
          <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-border bg-card p-4">
            <h3 className="font-bold text-foreground">{prompt.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{prompt.description}</p>
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-foreground">Requirements:</h4>
              <ul className="mt-2 space-y-2">
                {prompt.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] text-primary">
                      {idx + 1}
                    </span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-foreground">Your Explanation:</h4>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain your design decisions..."
                rows={6}
                className="mt-2 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700"
            >
              Submit Design
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Canvas area */}
          <div className="flex flex-1 flex-col">
            {/* Toolbar */}
            <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2">
              <button
                onClick={() => setSelectedTool('select')}
                className={`rounded-lg p-2 ${selectedTool === 'select' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
                title="Select"
              >
                <MousePointer className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSelectedTool('rect')}
                className={`rounded-lg p-2 ${selectedTool === 'rect' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
                title="Rectangle"
              >
                <Square className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSelectedTool('circle')}
                className={`rounded-lg p-2 ${selectedTool === 'circle' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
                title="Circle"
              >
                <Circle className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSelectedTool('arrow')}
                className={`rounded-lg p-2 ${selectedTool === 'arrow' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
                title="Arrow"
              >
                <Minus className="h-5 w-5 rotate-[-30deg]" />
              </button>
              <button
                onClick={() => setSelectedTool('text')}
                className={`rounded-lg p-2 ${selectedTool === 'text' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
                title="Text"
              >
                <Type className="h-5 w-5" />
              </button>
              
              <div className="mx-2 h-6 w-px bg-border" />
              
              <button
                onClick={undo}
                disabled={historyIndex === 0}
                className="rounded-lg p-2 text-muted-foreground hover:bg-secondary disabled:opacity-50"
                title="Undo"
              >
                <Undo className="h-5 w-5" />
              </button>
              <button
                onClick={deleteSelected}
                disabled={!selectedShape}
                className="rounded-lg p-2 text-muted-foreground hover:bg-secondary disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="h-5 w-5" />
              </button>

              <div className="ml-auto text-sm text-muted-foreground">
                {shapes.length} components
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-hidden">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="h-full w-full cursor-crosshair"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
