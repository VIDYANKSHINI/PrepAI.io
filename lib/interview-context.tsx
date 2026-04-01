'use client'

import { createContext, useContext, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  provider: 'google' | 'github' | 'linkedin'
}

interface ResumeData {
  name: string | null
  email: string | null
  phone: string | null
  summary: string | null
  skills: string[]
  experience: {
    title: string
    company: string
    duration: string | null
    description: string | null
  }[]
  education: {
    degree: string
    institution: string
    year: string | null
  }[]
  projects: {
    name: string
    description: string | null
    technologies: string[]
  }[]
  suggestedQuestions: string[]
}

interface BehavioralMetrics {
  eyeContact: number
  facialExpressions: {
    neutral: number
    happy: number
    confident: number
    nervous: number
  }
  posture: number
  speakingPace: number
  fluency: number
  fillerWords: number
  responseTime: number[]
}

interface InterviewConfig {
  name: string
  role: string
  difficulty: 'easy' | 'medium' | 'hard'
  interviewType: 'full' | 'technical' | 'behavioral'
  microphoneEnabled: boolean
  cameraEnabled: boolean
  resumeData?: ResumeData | null
  resumeText?: string
}

interface RoundScore {
  score: number
  maxScore: number
  feedback: string
  details: Record<string, number>
}

interface InterviewResults {
  overallScore: number
  communication: number
  content: number
  confidence: number
  problemSolving: number
  behavioralMetrics: BehavioralMetrics
  transcript: { role: 'ai' | 'user'; text: string; timestamp: number }[]
  duration: number
  questionsAnswered: number
  roundScores: {
    screening: RoundScore | null
    technical: RoundScore | null
    liveCoding: RoundScore | null
    systemDesign: RoundScore | null
    behavioral: RoundScore | null
  }
}

type InterviewStep = 
  | 'auth' 
  | 'home' 
  | 'setup' 
  | 'round1-screening' 
  | 'round2-technical' 
  | 'round3-livecoding' 
  | 'round4-systemdesign' 
  | 'round5-behavioral' 
  | 'results' 
  | 'analysis'

interface InterviewContextType {
  user: User | null
  setUser: (user: User | null) => void
  config: InterviewConfig | null
  setConfig: (config: InterviewConfig | null) => void
  currentStep: InterviewStep
  setCurrentStep: (step: InterviewStep) => void
  currentRound: number
  setCurrentRound: (round: number) => void
  results: InterviewResults | null
  setResults: (results: InterviewResults | null) => void
  roundScores: InterviewResults['roundScores']
  updateRoundScore: (round: keyof InterviewResults['roundScores'], score: RoundScore) => void
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined)

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [config, setConfig] = useState<InterviewConfig | null>(null)
  const [currentStep, setCurrentStep] = useState<InterviewStep>('home')
  const [currentRound, setCurrentRound] = useState(0)
  const [results, setResults] = useState<InterviewResults | null>(null)
  const [roundScores, setRoundScores] = useState<InterviewResults['roundScores']>({
    screening: null,
    technical: null,
    liveCoding: null,
    systemDesign: null,
    behavioral: null,
  })

  const updateRoundScore = (round: keyof InterviewResults['roundScores'], score: RoundScore) => {
    setRoundScores(prev => ({ ...prev, [round]: score }))
  }

  return (
    <InterviewContext.Provider value={{ 
      user,
      setUser,
      config, 
      setConfig, 
      currentStep, 
      setCurrentStep,
      currentRound,
      setCurrentRound,
      results,
      setResults,
      roundScores,
      updateRoundScore,
    }}>
      {children}
    </InterviewContext.Provider>
  )
}

export function useInterview() {
  const context = useContext(InterviewContext)
  if (!context) {
    throw new Error('useInterview must be used within InterviewProvider')
  }
  return context
}

export type { InterviewConfig, InterviewResults, BehavioralMetrics, ResumeData, User, RoundScore, InterviewStep }
