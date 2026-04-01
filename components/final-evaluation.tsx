'use client'

import { useInterview } from '@/lib/interview-context'
import { PrepLogo } from './prep-logo'
import { 
  Trophy, Target, MessageSquare, Lightbulb, TrendingUp, 
  CheckCircle, AlertCircle, ArrowRight, RotateCcw, Home
} from 'lucide-react'

export function FinalEvaluation() {
  const { config, roundScores, setCurrentStep, setCurrentRound } = useInterview()

  const scores = {
    screening: roundScores.screening?.score || 0,
    technical: roundScores.technical?.score || 0,
    liveCoding: roundScores.liveCoding?.score || 0,
    systemDesign: roundScores.systemDesign?.score || 0,
    behavioral: roundScores.behavioral?.score || 0,
  }

  const overallScore = Math.round(
    (scores.screening + scores.technical + scores.liveCoding + scores.systemDesign + scores.behavioral) / 5
  )

  const technicalScore = Math.round((scores.technical + scores.liveCoding + scores.systemDesign) / 3)
  const communicationScore = Math.round((scores.behavioral + scores.screening) / 2)
  const confidenceScore = Math.round(scores.behavioral * 0.6 + scores.liveCoding * 0.4)
  const problemSolvingScore = Math.round((scores.technical + scores.systemDesign) / 2)

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-500' }
    if (score >= 80) return { grade: 'A', color: 'text-green-500' }
    if (score >= 70) return { grade: 'B', color: 'text-blue-500' }
    if (score >= 60) return { grade: 'C', color: 'text-yellow-500' }
    if (score >= 50) return { grade: 'D', color: 'text-orange-500' }
    return { grade: 'F', color: 'text-red-500' }
  }

  const overallGrade = getGrade(overallScore)

  const strengths = []
  const improvements = []

  if (scores.technical >= 70) strengths.push('Strong technical fundamentals')
  else improvements.push('Practice more coding problems')

  if (scores.liveCoding >= 70) strengths.push('Good at explaining while coding')
  else improvements.push('Practice thinking aloud while solving problems')

  if (scores.systemDesign >= 70) strengths.push('Solid system design thinking')
  else improvements.push('Study common system design patterns')

  if (scores.behavioral >= 70) strengths.push('Excellent communication skills')
  else improvements.push('Prepare STAR method responses for behavioral questions')

  if (scores.screening >= 70) strengths.push('Well-prepared with fundamentals')
  else improvements.push('Review basic concepts and MCQ practice')

  const restartInterview = () => {
    setCurrentRound(0)
    setCurrentStep('setup')
  }

  const goHome = () => {
    setCurrentRound(0)
    setCurrentStep('home')
  }

  return (
    <div className="screen-container relative bg-background py-6 overflow-y-auto">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-green-500/10 blur-3xl"></div>
      </div>

      <div className="content-container relative z-10 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PrepLogo className="h-8 w-8" />
            <span className="text-xl font-bold text-foreground">Final Evaluation</span>
          </div>
          <div className="text-sm text-muted-foreground">{config?.name}</div>
        </div>

        {/* Overall Score Card */}
        <div className="mb-8 rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 p-6 shadow-xl sm:p-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-6">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-8 border-primary/20">
                <svg className="absolute inset-0" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-primary/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${overallScore * 2.64} 264`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    className="text-primary transition-all duration-1000"
                  />
                </svg>
                <div className="text-center">
                  <span className="text-3xl font-bold text-foreground">{overallScore}</span>
                  <span className="block text-xs text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-foreground">Overall Performance</h2>
                </div>
                <p className="mt-1 text-muted-foreground">
                  Grade: <span className={`text-xl font-bold ${overallGrade.color}`}>{overallGrade.grade}</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {config?.role} | {config?.difficulty} difficulty
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={restartInterview}
                className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
              >
                <RotateCcw className="h-4 w-4" />
                Retry
              </button>
              <button
                onClick={goHome}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110"
              >
                <Home className="h-4 w-4" />
                Home
              </button>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Technical', score: technicalScore, icon: Target, color: 'text-blue-500' },
            { label: 'Communication', score: communicationScore, icon: MessageSquare, color: 'text-green-500' },
            { label: 'Confidence', score: confidenceScore, icon: Lightbulb, color: 'text-yellow-500' },
            { label: 'Problem Solving', score: problemSolvingScore, icon: TrendingUp, color: 'text-purple-500' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-secondary ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold text-foreground">{item.score}%</p>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full bg-current transition-all duration-1000 ${item.color}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Round-by-Round Breakdown */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-bold text-foreground">Round-by-Round Results</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: 'Screening', score: scores.screening, feedback: roundScores.screening?.feedback },
              { name: 'Technical', score: scores.technical, feedback: roundScores.technical?.feedback },
              { name: 'Live Coding', score: scores.liveCoding, feedback: roundScores.liveCoding?.feedback },
              { name: 'System Design', score: scores.systemDesign, feedback: roundScores.systemDesign?.feedback },
              { name: 'Behavioral', score: scores.behavioral, feedback: roundScores.behavioral?.feedback },
            ].map((round, idx) => (
              <div key={round.name} className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {idx + 1}
                  </span>
                  <span className={`text-lg font-bold ${getGrade(round.score).color}`}>
                    {round.score.toFixed(0)}%
                  </span>
                </div>
                <h4 className="font-semibold text-foreground">{round.name}</h4>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000"
                    style={{ width: `${round.score}%` }}
                  />
                </div>
                {round.feedback && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{round.feedback}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Strengths */}
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-bold text-foreground">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {strengths.length > 0 ? strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20 text-[10px] text-green-500">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-foreground">{strength}</span>
                </li>
              )) : (
                <li className="text-sm text-muted-foreground">Keep practicing to identify your strengths</li>
              )}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
            <div className="mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-bold text-foreground">Areas for Improvement</h3>
            </div>
            <ul className="space-y-3">
              {improvements.length > 0 ? improvements.map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500/20 text-[10px] text-yellow-500">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-foreground">{improvement}</span>
                </li>
              )) : (
                <li className="text-sm text-muted-foreground">Excellent! Keep up the great work</li>
              )}
            </ul>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-bold text-foreground">Recommended Next Steps</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Practice More</p>
                <p className="text-xs text-muted-foreground">Try different difficulty levels</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Review Feedback</p>
                <p className="text-xs text-muted-foreground">Deep dive into responses</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Track Progress</p>
                <p className="text-xs text-muted-foreground">View your improvement</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
