'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useInterview, type BehavioralMetrics } from '@/lib/interview-context'
import { PrepLogo } from './prep-logo'
import Image from 'next/image'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Clock,
  Volume2,
  Eye,
  Activity,
  SkipForward,
  ArrowRight,
  User
} from 'lucide-react'

// Pre-defined interview questions
const DEFAULT_QUESTIONS = {
  HR: [
    
    "Tell me about yourself and what makes you a good fit for this role.",
    "Can you describe a challenging situation at work and how you handled it?",
    "What are your greatest strengths and how do they help you professionally?",
    "Where do you see yourself in five years?",
    "Why are you interested in this position and our company?"
  ],
  Technical: [
    "Explain a complex technical project you've worked on recently.",
    "How do you approach debugging a difficult issue in production?",
    "Describe your experience with system design and architecture decisions.",
    "How do you stay updated with the latest technologies in your field?",
    "Walk me through how you would design a scalable microservices architecture."
  ]
}

export function InterviewSession() {
  const { config, setCurrentStep, setResults } = useInterview()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [textInput, setTextInput] = useState('')
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  
  // Question tracking
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [hasSpoken, setHasSpoken] = useState(false)
  const [userResponses, setUserResponses] = useState<{question: string; answer: string; duration: number}[]>([])
  const responseStartTimeRef = useRef<number>(0)
  
  // Get questions based on interview type or resume
  const questions = config?.resumeData?.suggestedQuestions?.length 
    ? config.resumeData.suggestedQuestions.slice(0, 5)
    : DEFAULT_QUESTIONS[config?.interviewType || 'HR']
  
  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  
  // Behavioral metrics tracking
  const [behavioralMetrics, setBehavioralMetrics] = useState<BehavioralMetrics>({
    eyeContact: 85,
    facialExpressions: { neutral: 60, happy: 20, confident: 15, nervous: 5 },
    posture: 80,
    speakingPace: 75,
    fluency: 82,
    fillerWords: 0,
    responseTime: [],
  })
  
  // Transcript for results
  const transcriptRef = useRef<{ role: 'ai' | 'user'; text: string; timestamp: number }[]>([])

  // Initialize media stream
  useEffect(() => {
    const initMedia = async () => {
      try {
        setIsInitializing(true)
        setPermissionError(null)
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: config?.cameraEnabled ?? true,
          audio: config?.microphoneEnabled ?? true
        })
        
        streamRef.current = stream
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        
        setIsInitializing(false)
        
        // Speak greeting after initialization
        setTimeout(() => {
          const greeting = `Hello ${config?.name}! Welcome to your ${config?.interviewType} interview for the ${config?.role} position. I'll be asking you ${totalQuestions} questions today. Let's begin with the first question.`
          speakText(greeting, () => {
            // After greeting, speak first question
            setTimeout(() => {
              speakText(currentQuestion, () => {
                responseStartTimeRef.current = Date.now()
                startListening()
              })
              transcriptRef.current.push({ role: 'ai', text: currentQuestion, timestamp: Date.now() })
            }, 500)
          })
        }, 1500)
        
      } catch (err) {
        console.error('Error accessing media devices:', err)
        setPermissionError('Unable to access camera/microphone. Please check your browser permissions.')
        setIsInitializing(false)
      }
    }

    initMedia()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Text to speech function
  const speakText = useCallback((text: string, onEnd?: () => void) => {
    if (!window.speechSynthesis) return
    
    window.speechSynthesis.cancel()
    setIsAISpeaking(true)
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1.1
    
    // Load voices and select a female voice
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      const femaleVoice = voices.find(v => 
        v.name.includes('Samantha') || 
        v.name.includes('Victoria') || 
        v.name.includes('Karen') ||
        v.name.includes('Google UK English Female') ||
        v.name.includes('Microsoft Zira') ||
        (v.name.includes('Female') && v.lang.startsWith('en'))
      ) || voices.find(v => v.lang.startsWith('en'))
      
      if (femaleVoice) utterance.voice = femaleVoice
    }
    
    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices()
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
    
    utterance.onend = () => {
      setIsAISpeaking(false)
      onEnd?.()
    }
    
    window.speechSynthesis.speak(utterance)
  }, [])

  // Speech recognition
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
          setHasSpoken(true)
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        setCurrentTranscript(prev => prev + ' ' + finalTranscript)
        // Also update text input so it's captured in the response
        setTextInput(prev => prev + ' ' + finalTranscript)
      }

      // Track filler words
      const fillerWordsPattern = /\b(um|uh|like|you know|basically|actually|literally)\b/gi
      const fillers = (finalTranscript.match(fillerWordsPattern) || []).length
      if (fillers > 0) {
        setBehavioralMetrics(prev => ({
          ...prev,
          fillerWords: prev.fillerWords + fillers
        }))
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (event.error !== 'no-speech') {
        setIsListening(false)
      }
    }

    recognition.onend = () => {
      // Restart if still supposed to be listening
      if (isListening && !isAISpeaking) {
        try {
          recognition.start()
        } catch {
          setIsListening(false)
        }
      }
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch {
      console.warn('Recognition already started')
    }
  }, [isListening, isAISpeaking])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [])

  const handleNextQuestion = useCallback(() => {
    stopListening()
    
    // Save current response - prefer text input if available, then speech
    const responseTime = (Date.now() - responseStartTimeRef.current) / 1000
    const answer = textInput.trim() || currentTranscript.trim() || '[No response provided]'
    
    setUserResponses(prev => [...prev, {
      question: currentQuestion,
      answer,
      duration: responseTime
    }])
    
    transcriptRef.current.push({ role: 'user', text: answer, timestamp: Date.now() })
    
    setBehavioralMetrics(prev => ({
      ...prev,
      responseTime: [...prev.responseTime, responseTime]
    }))
    
    setCurrentTranscript('')
    setTextInput('')
    setHasSpoken(false)
    
    if (currentQuestionIndex < totalQuestions - 1) {
      // Move to next question
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      
      const feedback = responseTime > 5 
        ? "Good answer! Let's move to the next question."
        : "Alright, here's the next question."
      
      speakText(feedback, () => {
        setTimeout(() => {
          speakText(questions[nextIndex], () => {
            responseStartTimeRef.current = Date.now()
            startListening()
          })
          transcriptRef.current.push({ role: 'ai', text: questions[nextIndex], timestamp: Date.now() })
        }, 300)
      })
    } else {
      // End interview
      endInterview()
    }
  }, [currentQuestionIndex, currentQuestion, currentTranscript, textInput, questions, totalQuestions, speakText, startListening, stopListening])

  const handleSkipQuestion = useCallback(() => {
    stopListening()
    
    // Save as skipped
    setUserResponses(prev => [...prev, {
      question: currentQuestion,
      answer: '[Skipped]',
      duration: 0
    }])
    
    transcriptRef.current.push({ role: 'user', text: '[Question skipped]', timestamp: Date.now() })
    
    setCurrentTranscript('')
    setTextInput('')
    setHasSpoken(false)
    
    if (currentQuestionIndex < totalQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      
      speakText("No problem, let's skip to the next question.", () => {
        setTimeout(() => {
          speakText(questions[nextIndex], () => {
            responseStartTimeRef.current = Date.now()
            startListening()
          })
          transcriptRef.current.push({ role: 'ai', text: questions[nextIndex], timestamp: Date.now() })
        }, 300)
      })
    } else {
      endInterview()
    }
  }, [currentQuestionIndex, currentQuestion, questions, totalQuestions, speakText, startListening, stopListening])

  const toggleMic = useCallback(() => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = !track.enabled
      })
      setIsMicOn(prev => !prev)
      
      if (isMicOn) {
        stopListening()
      } else if (!isAISpeaking) {
        startListening()
      }
    }
  }, [isMicOn, isAISpeaking, startListening, stopListening])

  const toggleCamera = useCallback(() => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks()
      videoTracks.forEach(track => {
        track.enabled = !track.enabled
      })
      setIsCameraOn(prev => !prev)
    }
  }, [])

  const endInterview = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    
    // Calculate final scores
    const avgResponseTime = behavioralMetrics.responseTime.length > 0
      ? behavioralMetrics.responseTime.reduce((a, b) => a + b, 0) / behavioralMetrics.responseTime.length
      : 0
    
    const totalWords = userResponses.reduce((acc, r) => acc + r.answer.split(' ').length, 0)
    const fluencyScore = Math.max(0, Math.min(100, 100 - (behavioralMetrics.fillerWords * 5)))
    const confidenceScore = Math.round((behavioralMetrics.eyeContact + behavioralMetrics.posture + fluencyScore) / 3)
    const communicationScore = Math.round((behavioralMetrics.speakingPace + fluencyScore + 80) / 3)
    const contentScore = Math.min(100, Math.round(70 + (totalWords / userResponses.length) * 0.5))
    const overallScore = Math.round((confidenceScore + communicationScore + contentScore) / 3)
    
    setResults({
      overallScore,
      communication: communicationScore,
      content: contentScore,
      confidence: confidenceScore,
      behavioralMetrics: {
        ...behavioralMetrics,
        fluency: fluencyScore,
      },
      transcript: transcriptRef.current,
      duration: elapsedTime,
      questionsAnswered: userResponses.length + 1,
      userResponses,
    } as any)
    
    setCurrentStep('results')
  }, [behavioralMetrics, elapsedTime, userResponses, setCurrentStep, setResults])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Simulate behavioral metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBehavioralMetrics(prev => ({
        ...prev,
        eyeContact: Math.min(100, Math.max(60, prev.eyeContact + (Math.random() - 0.5) * 5)),
        posture: Math.min(100, Math.max(60, prev.posture + (Math.random() - 0.5) * 3)),
        speakingPace: Math.min(100, Math.max(50, prev.speakingPace + (Math.random() - 0.5) * 4)),
      }))
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="screen-container relative flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <PrepLogo />
          <span className="text-lg font-bold text-foreground sm:text-xl">PrepAI.io</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Question progress */}
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5">
            <span className="text-xs font-medium text-primary sm:text-sm">
              Q {currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
          
          {/* Timer */}
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 sm:px-4 sm:py-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-xs font-medium text-foreground sm:text-sm">{formatTime(elapsedTime)}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* AI Interviewer Panel */}
        <div className="relative flex flex-col items-center justify-center border-b border-border bg-gradient-to-br from-card to-secondary/30 p-6 lg:w-1/3 lg:border-b-0 lg:border-r">
          {/* AI Avatar */}
          <div className="relative mb-6">
            <div className={`relative h-32 w-32 overflow-hidden rounded-full border-4 sm:h-40 sm:w-40 ${isAISpeaking ? 'border-primary animate-pulse' : 'border-border'}`}>
              <Image
                src="/images/ai-interviewer.jpg"
                alt="AI Interviewer"
                fill
                className="object-cover"
              />
            </div>
            {isAISpeaking && (
              <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-3 py-1">
                <Volume2 className="h-3 w-3 animate-pulse text-primary-foreground" />
                <span className="text-xs font-medium text-primary-foreground">Speaking</span>
              </div>
            )}
          </div>
          
          <h3 className="mb-1 text-lg font-semibold text-foreground">Sarah</h3>
          <p className="mb-6 text-sm text-muted-foreground">AI Interview Assistant</p>
          
          {/* Current question */}
          <div className="w-full rounded-xl bg-card p-4 shadow-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
            <p className="text-sm leading-relaxed text-foreground sm:text-base">
              {currentQuestion}
            </p>
          </div>
          
          {/* Real-time metrics */}
          <div className="mt-6 grid w-full grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-card p-3">
              <Eye className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Eye Contact</p>
                <p className="text-sm font-semibold text-foreground">{Math.round(behavioralMetrics.eyeContact)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-card p-3">
              <Activity className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-xs text-muted-foreground">Pace</p>
                <p className="text-sm font-semibold text-foreground">{Math.round(behavioralMetrics.speakingPace)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Video and controls area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Video container */}
          <div className="relative flex-1 bg-black" style={{ minHeight: '300px', maxHeight: 'calc(100vh - 200px)' }}>
            {isInitializing ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="mt-4 text-white">Initializing camera and microphone...</p>
                </div>
              </div>
            ) : permissionError ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-md text-center">
                  <VideoOff className="mx-auto h-16 w-16 text-red-500" />
                  <p className="mt-4 text-white">{permissionError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Main video feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${!isCameraOn ? 'hidden' : ''}`}
                />
                
                {/* Camera off placeholder */}
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                    <div className="text-center">
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                        <User className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <p className="mt-4 text-lg text-foreground">{config?.name || 'You'}</p>
                      <p className="text-sm text-muted-foreground">Camera is off</p>
                    </div>
                  </div>
                )}

                {/* Listening indicator */}
                {isListening && !isAISpeaking && (
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-green-500 px-4 py-2">
                    <Mic className="h-4 w-4 animate-pulse text-white" />
                    <span className="text-sm font-medium text-white">Listening...</span>
                  </div>
                )}

                {/* Live transcript from speech */}
                {currentTranscript && (
                  <div className="absolute bottom-44 left-4 right-4 rounded-lg bg-black/80 p-3">
                    <p className="text-xs font-medium uppercase text-green-400">Voice input:</p>
                    <p className="mt-1 text-sm text-white">{currentTranscript}</p>
                  </div>
                )}

                {/* Text input area */}
                <div className="absolute bottom-24 left-4 right-4">
                  <div className="rounded-lg bg-black/90 p-3">
                    <p className="mb-2 text-xs font-medium uppercase text-primary">Type or speak your response:</p>
                    <textarea
                      value={textInput}
                      onChange={(e) => {
                        setTextInput(e.target.value)
                        setHasSpoken(true)
                      }}
                      placeholder="Type your answer here, or speak into the microphone..."
                      className="w-full resize-none rounded-lg bg-white/10 p-3 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Mic indicator */}
                {isMicOn && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-green-500/80 px-3 py-1.5">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                    <span className="text-xs font-medium text-white">Live</span>
                  </div>
                )}

                {/* User info */}
                <div className="absolute bottom-4 right-4 rounded-lg bg-black/60 px-3 py-2">
                  <p className="text-sm font-medium text-white">{config?.name || 'You'}</p>
                </div>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 border-t border-border bg-card p-4">
            <button
              onClick={toggleMic}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                isMicOn 
                  ? 'bg-secondary text-foreground hover:bg-secondary/80' 
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
              title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>

            <button
              onClick={toggleCamera}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                isCameraOn 
                  ? 'bg-secondary text-foreground hover:bg-secondary/80' 
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
              title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>

            {/* Skip button */}
            <button
              onClick={handleSkipQuestion}
              disabled={isAISpeaking}
              className="flex h-12 items-center gap-2 rounded-full bg-secondary px-5 text-sm font-medium text-foreground transition-all hover:bg-secondary/80 disabled:opacity-50"
            >
              <SkipForward className="h-4 w-4" />
              Skip
            </button>

            {/* Next button */}
            <button
              onClick={handleNextQuestion}
              disabled={isAISpeaking}
              className="flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
            >
              {currentQuestionIndex < totalQuestions - 1 ? 'Next' : 'Finish'}
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={endInterview}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white transition-all hover:bg-red-600"
              title="End interview"
            >
              <PhoneOff className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
