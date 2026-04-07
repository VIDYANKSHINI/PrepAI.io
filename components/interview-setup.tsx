'use client'

import { useState } from 'react'
import { useInterview } from "@/lib/interview-context"
import { PrepLogo } from "./prep-logo"
import { ChevronDown, User, Briefcase, Zap, Play } from 'lucide-react'

const roles = [
  'Software Development Engineer (SDE)',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Product Manager',
  'UI/UX Designer',
  'QA Engineer',
]
WHI
const difficulties = [
  { value: 'easy', label: 'Easy', description: 'Entry level / Fresher', color: 'text-white-500' },
  { value: 'medium', label: 'Medium', description: '2-5 years experience', color: 'text-white-500' },
  { value: 'hard', label: 'Hard', description: 'Senior / Lead positions', color: 'text-white-500' },
]

const interviewTypes = [
  { value: 'full', label: 'Full Interview', description: 'All 5 rounds', icon: '5' },
  { value: 'technical', label: 'Technical Only', description: 'Coding + System Design', icon: '3' },
  { value: 'behavioral', label: 'Behavioral Only', description: 'HR + Screening', icon: '2' },
]

export function InterviewSetup() {
  const { user, setConfig, setCurrentStep, setCurrentRound } = useInterview()
  
  const [name, setName] = useState(user?.name || '')
  const [role, setRole] = useState('')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [interviewType, setInterviewType] = useState<'full' | 'technical' | 'behavioral'>('full')
  const [isRoleOpen, setIsRoleOpen] = useState(false)

  const handleStartInterview = () => {
    if (!name.trim() || !role) return

    setConfig({
      name: name.trim(),
      role,
      difficulty,
      interviewType,
      microphoneEnabled: true,
      cameraEnabled: true,
    })
    setCurrentRound(1)
    setCurrentStep('round1-screening')
  }

  const isValid = name.trim() && role

  return (
    <div className="screen-container relative bg-background">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:h-96 sm:w-96"></div>
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl sm:h-96 sm:w-96"></div>
      </div>

      <div className="content-container relative z-10 max-w-2xl py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <div className="flex items-center gap-3">
            <PrepLogo className="h-8 w-8" />
            <span className="text-xl font-bold text-foreground sm:text-2xl">PrepAI.io</span>
          </div>
          {user && (
            <div className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden text-muted-foreground sm:inline">{user.name}</span>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              <span className="text-balance">Set Up Your Interview</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
              Configure your practice session to match your target role
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5 rounded-xl border border-border bg-card p-4 shadow-lg sm:space-y-6 sm:rounded-2xl sm:p-6 lg:p-8">
            {/* Name */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <User className="h-4 w-4 text-primary" />
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Briefcase className="h-4 w-4 text-primary" />
                Target Role
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsRoleOpen(!isRoleOpen)}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <span className={role ? 'text-foreground' : 'text-muted-foreground'}>
                    {role || 'Select your target role'}
                  </span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isRoleOpen ? 'rotate-180' : ''}`} />
                </button>
                {isRoleOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-card shadow-xl">
                    {roles.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRole(r)
                          setIsRoleOpen(false)
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-primary/10 ${role === r ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <Zap className="h-4 w-4 text-primary" />
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {difficulties.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDifficulty(d.value as 'easy' | 'medium' | 'hard')}
                    className={`rounded-lg border p-3 text-center transition-all ${
                      difficulty === d.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    <div className={`text-sm font-semibold ${d.color}`}>{d.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{d.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interview Type */}
            <div>
              <label className="mb-3 text-sm font-medium text-foreground">
                Interview Type
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {interviewTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setInterviewType(type.value as 'full' | 'technical' | 'behavioral')}
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                      interviewType === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                      interviewType === type.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {type.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interview rounds preview */}
            <div className="rounded-lg border border-border/50 bg-background/50 p-4">
              <h3 className="mb-3 text-sm font-medium text-foreground">Interview Rounds</h3>
              <div className="flex flex-wrap items-center gap-2">
                {['Screening', 'Technical', 'Live Coding', 'System Design', 'Behavioral'].map((round, index) => {
                  const isIncluded = 
                    interviewType === 'full' ||
                    (interviewType === 'technical' && [1, 2, 3].includes(index + 1)) ||
                    (interviewType === 'behavioral' && [0, 4].includes(index))
                  
                  return (
                    <div
                      key={round}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                        isIncluded
                          ? 'bg-primary/10 text-primary'
                          : 'bg-secondary/50 text-muted-foreground line-through'
                      }`}
                    >
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                        isIncluded ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                      }`}>
                        {index + 1}
                      </span>
                      {round}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={handleStartInterview}
              disabled={!isValid}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              <Play className="h-5 w-5" />
              Start Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
