'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useInterview } from '@/lib/interview-context'
import { RoundProgress } from '../round-progress'
import { PrepLogo } from '../prep-logo'
import Image from 'next/image'
import { 
  Mic, MicOff, Video, VideoOff, Clock, CheckCircle, ArrowRight, 
  Code2, Volume2 
} from 'lucide-react'

const liveCodingProblem = {
  title: "Reverse a Linked List",
  description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

Please explain your thought process as you code. The interviewer is watching and listening to your approach.`,
  hints: [
    "Think about what pointers you need to keep track of",
    "Consider iterative vs recursive approaches",
    "What is the time and space complexity of your solution?",
  ],
  starterCode: `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  // Explain your approach as you code
  // The interviewer is listening to your thought process
  
}`,
}

export function Round3LiveCoding() {
  const { config, setCurrentStep, setCurrentRound, updateRoundScore } = useInterview()
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const [code, setCode] = useState(liveCodingProblem.starterCode)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const [aiMessage, setAiMessage] = useState("Please start by explaining your approach to this problem.")
  const [currentHint, setCurrentHint] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  // Setup camera
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error('Camera setup error:', error)
      }
    }
    setupCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Timer
  useEffect(() => {
    if (!hasStarted || isComplete) return
    const timer = setInterval(() => {
      setTimeElapsed((t) => t + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [hasStarted, isComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const speakText = useCallback((text: string) => {
    setIsAISpeaking(true)
    setAiMessage(text)
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1
      utterance.pitch = 1
      
      const voices = window.speechSynthesis.getVoices()
      const femaleVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Female'))
      if (femaleVoice) utterance.voice = femaleVoice
      
      utterance.onend = () => setIsAISpeaking(false)
      window.speechSynthesis.speak(utterance)
    } else {
      setTimeout(() => setIsAISpeaking(false), 2000)
    }
  }, [])

  const startInterview = () => {
    setHasStarted(true)
    speakText("Welcome to the live coding round. Please read the problem and explain your approach as you code. I'll be listening to your thought process. Take your time and think aloud.")
  }

  const requestHint = () => {
    if (currentHint < liveCodingProblem.hints.length) {
      speakText(`Here's a hint: ${liveCodingProblem.hints[currentHint]}`)
      setCurrentHint(currentHint + 1)
    } else {
      speakText("I've given you all the hints I have. Try your best to solve it!")
    }
  }

  const handleSubmit = () => {
    speakText("Great effort! Let me review your solution. You've completed the live coding round.")
    
    // Calculate a mock score based on code changes and time
    const codeChanged = code !== liveCodingProblem.starterCode
    const score = codeChanged ? Math.min(100, 60 + Math.random() * 40) : 40
    
    updateRoundScore('liveCoding', {
      score,
      maxScore: 100,
      feedback: codeChanged 
        ? "You demonstrated good problem-solving skills and explained your approach clearly."
        : "Remember to explain your thought process as you code.",
      details: {
        timeSpent: timeElapsed / 60,
        hintsUsed: currentHint,
        codeSubmitted: codeChanged,
      },
    })
    
    setTimeout(() => setIsComplete(true), 3000)
  }

  const proceedToNextRound = () => {
    setCurrentRound(4)
    setCurrentStep('round4-systemdesign')
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
              <h2 className="text-2xl font-bold text-foreground">Round 3 Complete!</h2>
              <p className="mt-2 text-muted-foreground">
                You&apos;ve completed the live coding interview.
              </p>
            </div>
            <button
              onClick={proceedToNextRound}
              className="mx-auto flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground hover:brightness-110"
            >
              Proceed to Round 4: System Design
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
                <h1 className="font-bold text-foreground">Round 3: Live Coding Interview</h1>
                <p className="text-xs text-muted-foreground">Explain your approach as you code</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
                <Clock className="h-4 w-4" />
                <span className="font-mono font-bold">{formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <RoundProgress />
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left side - Problem + Video */}
          <div className="flex w-2/5 flex-col border-r border-border">
            {/* AI Interviewer */}
            <div className="relative border-b border-border bg-card p-4">
              <div className="flex items-start gap-4">
                <div className={`relative h-16 w-16 overflow-hidden rounded-full border-2 ${isAISpeaking ? 'border-primary' : 'border-border'}`}>
                  <Image
                    src="/images/ai-interviewer.jpg"
                    alt="AI Interviewer"
                    fill
                    className="object-cover"
                  />
                  {isAISpeaking && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Volume2 className="h-6 w-6 animate-pulse text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Sarah (AI Interviewer)</span>
                    {isAISpeaking && (
                      <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-500">Speaking</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{aiMessage}</p>
                </div>
              </div>
            </div>

            {/* Your video */}
            <div className="relative flex-1 bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {config?.name?.charAt(0).toUpperCase() || 'Y'}
                  </div>
                </div>
              )}
              
              {/* Video controls */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                <button
                  onClick={toggleMute}
                  className={`rounded-full p-3 ${isMuted ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`rounded-full p-3 ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </button>
              </div>

              {/* Name tag */}
              <div className="absolute bottom-4 left-4 rounded-md bg-black/50 px-3 py-1 text-sm text-white">
                {config?.name || 'You'}
              </div>
            </div>

            {/* Problem description */}
            <div className="max-h-64 overflow-y-auto border-t border-border bg-card p-4">
              <h3 className="flex items-center gap-2 font-bold text-foreground">
                <Code2 className="h-5 w-5 text-primary" />
                {liveCodingProblem.title}
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                {liveCodingProblem.description}
              </p>
            </div>
          </div>

          {/* Right side - Code editor */}
          <div className="flex w-3/5 flex-col">
            {/* Start overlay */}
            {!hasStarted && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90">
                <div className="space-y-6 text-center">
                  <h2 className="text-2xl font-bold text-foreground">Ready to Start?</h2>
                  <p className="text-muted-foreground">
                    Your camera and microphone will be used.<br />
                    Explain your thought process as you code.
                  </p>
                  <button
                    onClick={startInterview}
                    className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:brightness-110"
                  >
                    Start Live Coding
                  </button>
                </div>
              </div>
            )}

            {/* Code editor */}
            <div className="flex-1 overflow-hidden">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-full w-full resize-none bg-[#1e1e2e] p-4 font-mono text-sm text-white focus:outline-none"
                spellCheck={false}
                disabled={!hasStarted}
              />
            </div>

            {/* Bottom controls */}
            <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3">
              <button
                onClick={requestHint}
                disabled={!hasStarted || currentHint >= liveCodingProblem.hints.length}
                className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
              >
                Request Hint ({liveCodingProblem.hints.length - currentHint} left)
              </button>
              <button
                onClick={handleSubmit}
                disabled={!hasStarted}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                Submit Solution
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
