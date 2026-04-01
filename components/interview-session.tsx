'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useInterview } from '@/lib/interview-context'

export function InterviewSession() {
  const { config, setCurrentStep, setResults } = useInterview()

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recognitionRef = useRef<any>(null)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [textInput, setTextInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  const questions = [
    "Tell me about yourself.",
    "Describe a challenging situation.",
    "What are your strengths?",
    "Where do you see yourself in 5 years?",
    "Why this company?"
  ]

  const currentQuestion = questions[currentQuestionIndex]

  // 🎤 Init Speech Recognition (ONCE)
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      let finalText = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript
        }
      }

      if (finalText) {
        setTextInput(prev => prev + ' ' + finalText)

        // ⏳ Auto-next after silence
        clearTimeout((window as any).silenceTimer)
        ;(window as any).silenceTimer = setTimeout(() => {
          handleNext()
        }, 5000)
      }
    }

    recognitionRef.current = recognition

    return () => recognition.stop()
  }, [])

  // 🎥 Camera Setup
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      })
  }, [])

  // ⏱ Timer
  useEffect(() => {
    const timer = setInterval(() => setElapsedTime(t => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  // 🔊 AI Speech
  const speakText = useCallback((text: string, cb?: () => void) => {
    const utter = new SpeechSynthesisUtterance(text)
    setIsAISpeaking(true)

    utter.onend = () => {
      setIsAISpeaking(false)
      cb?.()
    }

    speechSynthesis.speak(utter)
  }, [])

  // ▶ Start Listening
  const startListening = () => {
    recognitionRef.current?.start()
    setIsListening(true)
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  // 👉 Next Question
  const handleNext = useCallback(() => {
    stopListening()

    if (currentQuestionIndex < questions.length - 1) {
      const next = currentQuestionIndex + 1
      setCurrentQuestionIndex(next)
      setTextInput('')

      // 🤖 AI delay (real feel)
      setTimeout(() => {
        speakText(questions[next], startListening)
      }, 1000)

    } else {
      endInterview()
    }
  }, [currentQuestionIndex])

  // 🛑 End Interview
  const endInterview = () => {
    stopListening()
    streamRef.current?.getTracks().forEach(t => t.stop())

    setResults({
      overallScore: 85,
      duration: elapsedTime
    })

    setCurrentStep('results')
  }

  // 🎬 Start first question
  useEffect(() => {
    setTimeout(() => {
      speakText(currentQuestion, startListening)
    }, 1000)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-black text-white">

      {/* Header */}
      <div className="p-4 flex justify-between">
        <h1>Interview</h1>
        <span>{elapsedTime}s</span>
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-700 h-2">
        <div
          className="bg-blue-500 h-2"
          style={{ width: `${((currentQuestionIndex+1)/questions.length)*100}%` }}
        />
      </div>

      {/* Video */}
      <video ref={videoRef} autoPlay className="flex-1 object-cover" />

      {/* Question */}
      <div className="p-4">
        <p>{currentQuestion}</p>
      </div>

      {/* Input */}
      <textarea
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        className="p-2 text-black"
        placeholder="Speak or type..."
      />

      {/* Controls */}
      <div className="flex gap-2 p-4">
        <button onClick={handleNext} disabled={isAISpeaking}>
          Next
        </button>
        <button onClick={endInterview}>
          End
        </button>
      </div>

    </div>
  )
}