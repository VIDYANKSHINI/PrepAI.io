'use client'

import { useInterview } from '@/lib/interview-context'
import { PrepLogo } from './prep-logo'
import { 
  CheckCircle, 
  ArrowRight, 
  RotateCcw,
  Star,
  MessageSquare,
  Clock,
  TrendingUp,
  BarChart3
} from 'lucide-react'

export function InterviewResults() {
  const { config, results, setCurrentStep, setConfig, setResults } = useInterview()

  const handleStartNew = () => {
    setConfig(null)
    setResults(null)
    setCurrentStep('home')
  }

  const handleRetry = () => {
    setResults(null)
    setCurrentStep('live')
  }

  const handleViewAnalysis = () => {
    setCurrentStep('analysis')
  }

  // Use actual results or fallback to simulated
  const scores = results ? {
    overall: results.overallScore,
    communication: results.communication,
    content: results.content,
    confidence: results.confidence,
  } : {
    overall: 85,
    communication: 82,
    content: 88,
    confidence: 84,
  }

  const duration = results?.duration || 765
  const questionsAnswered = results?.questionsAnswered || 5

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Very Good'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Needs Improvement'
  }

  return (
    <div className="screen-container relative bg-background py-6 sm:py-8 lg:py-12">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-green-500/10 blur-3xl sm:h-96 sm:w-96"></div>
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl sm:h-96 sm:w-96"></div>
      </div>

      <div className="content-container relative z-10 max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3 sm:mb-12">
          <PrepLogo />
          <span className="text-xl font-bold text-foreground sm:text-2xl">PrepAI.io</span>
        </div>

        {/* Success message */}
        <div className="mb-8 text-center sm:mb-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 sm:mb-6 sm:h-20 sm:w-20">
            <CheckCircle className="h-8 w-8 text-green-500 sm:h-10 sm:w-10" />
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Interview Complete!</h1>
          <p className="mt-2 text-base text-muted-foreground sm:mt-3 sm:text-lg">
            Well done, {config?.name}! Here&apos;s your performance summary.
          </p>
        </div>

        {/* Score card */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-lg sm:mb-10 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:gap-8 lg:flex-row">
            {/* Overall score */}
            <div className="text-center">
              <div className="relative mx-auto h-36 w-36 sm:h-44 sm:w-44">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-secondary"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${scores.overall * 2.83} 283`}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-foreground sm:text-5xl">{scores.overall}</span>
                  <span className="text-xs text-muted-foreground sm:text-sm">out of 100</span>
                </div>
              </div>
              <p className="mt-3 text-lg font-semibold text-foreground sm:mt-4 sm:text-xl">{getScoreLabel(scores.overall)}</p>
            </div>

            {/* Individual scores */}
            <div className="flex-1 space-y-4 sm:space-y-5">
              {[
                { label: 'Communication', score: scores.communication, icon: MessageSquare, color: 'bg-blue-500' },
                { label: 'Content Quality', score: scores.content, icon: Star, color: 'bg-amber-500' },
                { label: 'Confidence', score: scores.confidence, icon: TrendingUp, color: 'bg-green-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 sm:gap-4">
                  <item.icon className="h-4 w-4 flex-shrink-0 text-primary sm:h-5 sm:w-5" />
                  <div className="flex-1">
                    <div className="mb-1 flex justify-between text-sm sm:mb-1.5">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-semibold text-foreground">{item.score}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary sm:h-2.5">
                      <div 
                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interview stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:mt-8 sm:grid-cols-4 sm:pt-8">
            <div className="text-center">
              <Clock className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-2 text-xl font-bold text-foreground sm:text-2xl">{formatTime(duration)}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Duration</p>
            </div>
            <div className="text-center">
              <MessageSquare className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-2 text-xl font-bold text-foreground sm:text-2xl">{questionsAnswered}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Questions</p>
            </div>
            <div className="text-center">
              <Star className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-2 text-xl font-bold text-foreground sm:text-2xl">{config?.interviewType}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Type</p>
            </div>
            <div className="text-center">
              <TrendingUp className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-2 text-xl font-bold text-foreground sm:text-2xl">{config?.role?.split(' ')[0]}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Role</p>
            </div>
          </div>
        </div>

        {/* View Analysis CTA */}
        <div className="mb-8 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center sm:mb-10">
          <BarChart3 className="mx-auto mb-3 h-10 w-10 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Want detailed insights?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            View your complete behavioral analysis, word-by-word transcript, and personalized recommendations.
          </p>
          <button
            onClick={handleViewAnalysis}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110"
          >
            <BarChart3 className="h-5 w-5" />
            View Detailed Analysis
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button
            onClick={handleRetry}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-semibold text-foreground transition-all hover:bg-secondary sm:w-auto sm:py-4"
          >
            <RotateCcw className="h-5 w-5" />
            Practice Again
          </button>
          <button
            onClick={handleStartNew}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 font-semibold text-foreground transition-all hover:bg-secondary/80 sm:w-auto sm:py-4"
          >
            New Interview
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
