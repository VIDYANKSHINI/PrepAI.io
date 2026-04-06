'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useInterview } from '@/lib/interview-context'
import { RoundProgress } from '../round-progress'
import { PrepLogo } from '../prep-logo'
import Image from 'next/image'
import { 
  Mic, MicOff, Video, VideoOff, Clock, CheckCircle, 
  ArrowRight, SkipForward, Volume2 
} from 'lucide-react'

const behavioralQuestions = [
  "Tell me about a challenging project you worked on. How did you handle it?",
  "Describe a situation where you had to work with a difficult team member.",
  "What is your biggest professional achievement so far?",
  "Where do you see yourself in 5 years?",
  "Why are you interested in this role and our company?",
]

export function Round5Behavioral() {
  const { config, setCurrentStep, updateRoundScore } = useInterview()
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{text: string; duration: number}[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  const recognitionRef = useRef<SpeechRecognition | null>(null)

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
    if (isComplete) return
    const timer = setInterval(() => setTimeElapsed((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [isComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript = transcript
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript)
          setCurrentAnswer(prev => prev + ' ' + finalTranscript)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (e) {
        console.error('Speech recognition error:', e)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speakText = useCallback((text: string) => {
    setIsAISpeaking(true)
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1
      utterance.pitch = 1
      
      const voices = window.speechSynthesis.getVoices()
      const femaleVoice = voices.find(v => 
        v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Female')
      )
      if (femaleVoice) utterance.voice = femaleVoice
      
      utterance.onend = () => {
        setIsAISpeaking(false)
        startListening()
      }
      window.speechSynthesis.speak(utterance)
    } else {
      setTimeout(() => {
        setIsAISpeaking(false)
        startListening()
      }, 2000)
    }
  }, [])

  // Speak first question
  useEffect(() => {
    const timeout = setTimeout(() => {
      speakText(behavioralQuestions[0])
    }, 1000)
    return () => clearTimeout(timeout)
  }, [speakText])

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

  const handleNext = () => {
    stopListening()
    
    const duration = (Date.now() - questionStartTime) / 1000
    const answer = currentAnswer.trim() || '[No response]'
    setAnswers([...answers, { text: answer, duration }])
    
    if (currentQuestion < behavioralQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setCurrentAnswer('')
      setTranscript('')
      setQuestionStartTime(Date.now())
      
      setTimeout(() => {
        speakText(behavioralQuestions[currentQuestion + 1])
      }, 500)
    } else {
      finishInterview()
    }
  }

  const handleSkip = () => {
    stopListening()
    
    setAnswers([...answers, { text: '[Skipped]', duration: 0 }])
    
    if (currentQuestion < behavioralQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setCurrentAnswer('')
      setTranscript('')
      setQuestionStartTime(Date.now())
      
      setTimeout(() => {
        speakText(behavioralQuestions[currentQuestion + 1])
      }, 500)
    } else {
      finishInterview()
    }
  }

  const finishInterview = () => {
    stopListening()
    
    const answeredCount = answers.filter(a => a.text !== '[Skipped]' && a.text !== '[No response]').length + 
      (currentAnswer.trim() ? 1 : 0)
    
    const score = (answeredCount / behavioralQuestions.length) * 100
    
    updateRoundScore('behavioral', {
      score,
      maxScore: 100,
      feedback: answeredCount >= 4 
        ? "Excellent communication skills demonstrated."
        : "Consider providing more detailed responses.",
      details: {
        questionsAnswered: answeredCount,
        totalTime: timeElapsed,
        averageResponseTime: timeElapsed / behavioralQuestions.length,
      },
    })
    
    speakText("Thank you for completing all the interview rounds. Let me compile your results.")
    setTimeout(() => setIsComplete(true), 3000)
  }

  const proceedToResults = () => {
    setCurrentStep('results')
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
              <h2 className="text-2xl font-bold text-foreground">Interview Complete!</h2>
              <p className="mt-2 text-muted-foreground">
                You&apos;ve completed all 5 rounds. Great job!
              </p>
            </div>
            <button
              onClick={proceedToResults}
              className="mx-auto flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground hover:brightness-110"
            >
              View Your Results
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
                <h1 className="font-bold text-foreground">Round 5: Behavioral Interview</h1>
                <p className="text-xs text-muted-foreground">
                  Question {currentQuestion + 1} of {behavioralQuestions.length}
                </p>
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
          {/* Left - AI Interviewer */}
          <div className="flex w-1/3 flex-col border-r border-border">
            <div className="relative flex-1 bg-card">
              <div className="flex h-full flex-col items-center justify-center p-6">
                <div className={`relative h-32 w-32 overflow-hidden rounded-full border-4 ${
                  isAISpeaking ? 'border-primary animate-pulse' : 'border-border'
                }`}>
                  <Image
                    src="/images/ai-interviewer.jpg"
                    alt="AI Interviewer"
                    fill
                    className="object-cover"
                  />
                  {isAISpeaking && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Volume2 className="h-8 w-8 animate-pulse text-white" />
                    </div>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">Sarah</h3>
                <p className="text-sm text-muted-foreground">HR Interviewer</p>
                {isAISpeaking && (
                  <span className="mt-2 rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-500">
                    Speaking...
                  </span>
                )}
              </div>
            </div>

            {/* Current question */}
            <div className="border-t border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase text-primary">Current Question</p>
              <p className="mt-2 text-sm text-foreground">{behavioralQuestions[currentQuestion]}</p>
            </div>
          </div>

          {/* Right - User video + response */}
          <div className="flex w-2/3 flex-col min-h-0">
            {/* Video */}
            <div className="relative flex-1 min-h-0 bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                    {config?.name?.charAt(0).toUpperCase() || 'Y'}
                  </div>
                </div>
              )}

              {/* Listening indicator */}
              {isListening && (
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-500 px-3 py-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  <span className="text-xs font-medium text-white">Listening...</span>
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

            {/* Response area */}
            <div className="flex-shrink-0 border-t border-border bg-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Your Response</p>
                {transcript && (
                  <span className="text-xs text-green-500">Voice detected</span>
                )}
              </div>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Speak or type your answer..."
                rows={2}
                className="w-full rounded-lg border border-border bg-background p-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
              <div className="mt-2 flex justify-end gap-3">
                <button
                  onClick={handleSkip}
                  className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                >
                  <SkipForward className="h-4 w-4" />
                  Skip
                </button>
                <button
                  onClick={handleNext}
                  disabled={isAISpeaking}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50"
                >
                  {currentQuestion < behavioralQuestions.length - 1 ? 'Next' : 'Finish'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
