'use client'

import { useInterview } from '@/lib/interview-context'
import { PrepLogo } from './prep-logo'
import { 
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Star,
  MessageSquare,
  Clock,
  TrendingUp,
  Eye,
  Activity,
  AlertCircle,
  Mic,
  CheckCircle,
  User,
  FileText,
  Timer,
  Hash,
  Zap
} from 'lucide-react'

export function InterviewAnalysis() {
  const { config, results, setCurrentStep, setConfig, setResults } = useInterview()

  const handleBack = () => {
    setCurrentStep('results')
  }

  const handleStartNew = () => {
    setConfig(null)
    setResults(null)
    setCurrentStep('home')
  }

  const handleRetry = () => {
    setResults(null)
    setCurrentStep('live')
  }

  const behavioralMetrics = results?.behavioralMetrics || {
    eyeContact: 85,
    facialExpressions: { neutral: 60, happy: 20, confident: 15, nervous: 5 },
    posture: 80,
    speakingPace: 75,
    fluency: 82,
    fillerWords: 3,
    responseTime: [15, 22, 18, 30, 25],
  }

  const userResponses = (results as any)?.userResponses || [
    { question: "Tell me about yourself", answer: "I'm a software engineer with 5 years experience...", duration: 45 },
    { question: "What are your strengths?", answer: "My key strengths include problem solving and teamwork...", duration: 38 },
    { question: "Describe a challenging project", answer: "Last year I led a migration project that was complex...", duration: 52 },
    { question: "Where do you see yourself in 5 years?", answer: "I see myself growing into a leadership role...", duration: 35 },
    { question: "Why this company?", answer: "I'm excited about the company's mission and values...", duration: 40 },
  ]

  const transcript = results?.transcript || []
  const duration = results?.duration || 765
  const totalWords = userResponses.reduce((acc: number, r: any) => acc + r.answer.split(' ').length, 0)
  const avgWordsPerAnswer = Math.round(totalWords / userResponses.length)
  const avgResponseTime = behavioralMetrics.responseTime.length > 0
    ? Math.round(behavioralMetrics.responseTime.reduce((a, b) => a + b, 0) / behavioralMetrics.responseTime.length)
    : 30

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  // Generate detailed feedback
  const generateFeedback = () => {
    const strengths = []
    const improvements = []

    if (behavioralMetrics.eyeContact >= 80) {
      strengths.push({
        title: 'Excellent Eye Contact',
        description: `You maintained strong eye contact at ${Math.round(behavioralMetrics.eyeContact)}%, demonstrating confidence and engagement. This creates a positive connection with interviewers and shows you're attentive.`,
        icon: Eye,
        metric: `${Math.round(behavioralMetrics.eyeContact)}%`
      })
    } else {
      improvements.push({
        title: 'Improve Eye Contact',
        description: `Your eye contact was at ${Math.round(behavioralMetrics.eyeContact)}%. Try to look directly at the camera lens to simulate natural eye contact. This helps build rapport with interviewers.`,
        icon: Eye,
        metric: `${Math.round(behavioralMetrics.eyeContact)}%`
      })
    }

    if (behavioralMetrics.posture >= 75) {
      strengths.push({
        title: 'Professional Posture',
        description: `Your posture score of ${Math.round(behavioralMetrics.posture)}% shows you maintained a professional appearance throughout. Good posture conveys confidence and preparedness.`,
        icon: User,
        metric: `${Math.round(behavioralMetrics.posture)}%`
      })
    } else {
      improvements.push({
        title: 'Posture Awareness',
        description: `Your posture score was ${Math.round(behavioralMetrics.posture)}%. Sit up straight with shoulders back. Consider positioning your camera at eye level for a more professional appearance.`,
        icon: User,
        metric: `${Math.round(behavioralMetrics.posture)}%`
      })
    }

    if (behavioralMetrics.speakingPace >= 70 && behavioralMetrics.speakingPace <= 85) {
      strengths.push({
        title: 'Natural Speaking Pace',
        description: 'Your speaking pace was well-balanced, making it easy for interviewers to follow your responses. You spoke clearly without rushing.',
        icon: Activity,
        metric: `${Math.round(behavioralMetrics.speakingPace)}%`
      })
    } else if (behavioralMetrics.speakingPace < 70) {
      improvements.push({
        title: 'Increase Speaking Pace',
        description: `Your speaking pace was ${Math.round(behavioralMetrics.speakingPace)}%, which is slower than optimal. Try to speak a bit faster while maintaining clarity to show enthusiasm.`,
        icon: Activity,
        metric: `${Math.round(behavioralMetrics.speakingPace)}%`
      })
    } else {
      improvements.push({
        title: 'Slow Down Speaking',
        description: `Your speaking pace was ${Math.round(behavioralMetrics.speakingPace)}%, which is quite fast. Try pausing between thoughts to appear more composed and thoughtful.`,
        icon: Activity,
        metric: `${Math.round(behavioralMetrics.speakingPace)}%`
      })
    }

    if (behavioralMetrics.fillerWords <= 5) {
      strengths.push({
        title: 'Articulate Speech',
        description: `Only ${behavioralMetrics.fillerWords} filler words detected throughout the interview. Your responses were clear and well-articulated without unnecessary pauses.`,
        icon: Mic,
        metric: `${behavioralMetrics.fillerWords} fillers`
      })
    } else {
      improvements.push({
        title: 'Reduce Filler Words',
        description: `${behavioralMetrics.fillerWords} filler words (um, uh, like, you know) were detected. Practice pausing silently instead of using fillers. This makes you sound more confident.`,
        icon: Mic,
        metric: `${behavioralMetrics.fillerWords} fillers`
      })
    }

    if (avgWordsPerAnswer >= 40) {
      strengths.push({
        title: 'Detailed Responses',
        description: `You averaged ${avgWordsPerAnswer} words per answer, providing thorough and detailed responses. This demonstrates your ability to elaborate on topics effectively.`,
        icon: FileText,
        metric: `${avgWordsPerAnswer} words avg`
      })
    } else {
      improvements.push({
        title: 'Elaborate More',
        description: `Your answers averaged ${avgWordsPerAnswer} words. Try to provide more details, examples, and context in your responses using the STAR method for behavioral questions.`,
        icon: FileText,
        metric: `${avgWordsPerAnswer} words avg`
      })
    }

    if (behavioralMetrics.facialExpressions.confident > behavioralMetrics.facialExpressions.nervous) {
      strengths.push({
        title: 'Confident Expression',
        description: `Your facial expressions showed ${behavioralMetrics.facialExpressions.confident}% confidence vs ${behavioralMetrics.facialExpressions.nervous}% nervousness. You appeared composed and self-assured.`,
        icon: TrendingUp,
        metric: `${behavioralMetrics.facialExpressions.confident}% confident`
      })
    } else {
      improvements.push({
        title: 'Project More Confidence',
        description: `Some nervousness (${behavioralMetrics.facialExpressions.nervous}%) was detected. Try relaxation techniques before interviews: deep breathing, positive visualization, or power poses.`,
        icon: TrendingUp,
        metric: `${behavioralMetrics.facialExpressions.nervous}% nervous`
      })
    }

    return { strengths: strengths.slice(0, 4), improvements: improvements.slice(0, 4) }
  }

  const { strengths, improvements } = generateFeedback()

  return (
    <div className="screen-container relative bg-background py-6 sm:py-8 lg:py-10">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:h-96 sm:w-96"></div>
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-green-500/5 blur-3xl sm:h-96 sm:w-96"></div>
      </div>

      <div className="content-container relative z-10 max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between sm:mb-10">
          <div className="flex items-center gap-3">
            <PrepLogo />
            <span className="text-xl font-bold text-foreground sm:text-2xl">PrepAI.io</span>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        {/* Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Detailed Analysis</h1>
          <p className="mt-1 text-muted-foreground">
            Complete breakdown of your interview performance, {config?.name}
          </p>
        </div>

        {/* Key Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Duration</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{formatTime(duration)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hash className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Total Words</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{totalWords}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Avg Response</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{avgResponseTime}s</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Filler Words</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{behavioralMetrics.fillerWords}</p>
          </div>
        </div>

        {/* Behavioral Analysis */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-lg sm:mb-8 sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground sm:mb-6 sm:text-xl">Behavioral Analysis</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-secondary/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-500" />
                <span className="font-medium text-foreground">Eye Contact</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{Math.round(behavioralMetrics.eyeContact)}%</div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div 
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${behavioralMetrics.eyeContact}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {behavioralMetrics.eyeContact >= 80 ? 'Excellent - Shows confidence' : 
                 behavioralMetrics.eyeContact >= 60 ? 'Good - Room for improvement' : 'Needs work'}
              </p>
            </div>
            
            <div className="rounded-xl bg-secondary/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-foreground">Posture</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{Math.round(behavioralMetrics.posture)}%</div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div 
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${behavioralMetrics.posture}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {behavioralMetrics.posture >= 80 ? 'Professional appearance' : 
                 behavioralMetrics.posture >= 60 ? 'Acceptable' : 'Needs improvement'}
              </p>
            </div>
            
            <div className="rounded-xl bg-secondary/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Activity className="h-5 w-5 text-amber-500" />
                <span className="font-medium text-foreground">Speaking Pace</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{Math.round(behavioralMetrics.speakingPace)}%</div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div 
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${behavioralMetrics.speakingPace}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {behavioralMetrics.speakingPace >= 70 && behavioralMetrics.speakingPace <= 85 ? 'Well-balanced pace' : 
                 behavioralMetrics.speakingPace < 70 ? 'Speaking too slowly' : 'Speaking too fast'}
              </p>
            </div>
            
            <div className="rounded-xl bg-secondary/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <span className="font-medium text-foreground">Fluency</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{Math.round(behavioralMetrics.fluency)}%</div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div 
                  className="h-full rounded-full bg-purple-500"
                  style={{ width: `${behavioralMetrics.fluency}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {behavioralMetrics.fluency >= 80 ? 'Very articulate' : 
                 behavioralMetrics.fluency >= 60 ? 'Clear speech' : 'Practice more'}
              </p>
            </div>
          </div>

          {/* Facial Expression Breakdown */}
          <div className="mt-6 rounded-xl bg-secondary/30 p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Facial Expression Analysis</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Object.entries(behavioralMetrics.facialExpressions).map(([expression, percentage]) => (
                <div key={expression} className="rounded-lg bg-card p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ 
                      backgroundColor: expression === 'confident' ? '#22c55e' : 
                                       expression === 'happy' ? '#3b82f6' :
                                       expression === 'nervous' ? '#ef4444' : '#6b7280'
                    }} />
                    <span className="text-xs capitalize text-muted-foreground">{expression}</span>
                  </div>
                  <p className="mt-1 text-lg font-bold text-foreground">{percentage}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question-by-Question Analysis */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-lg sm:mb-8 sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground sm:mb-6 sm:text-xl">Your Responses</h2>
          <div className="space-y-4">
            {userResponses.map((response: any, index: number) => (
              <div key={index} className="rounded-xl border border-border bg-secondary/20 p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Q{index + 1}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDuration(response.duration)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    {response.answer.split(' ').length} words
                  </span>
                </div>
                <p className="mb-2 text-sm font-medium text-foreground">{response.question}</p>
                <div className="rounded-lg bg-card p-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {response.answer === '[Skipped]' ? (
                      <span className="italic text-amber-500">Question was skipped</span>
                    ) : response.answer === '[No response provided]' ? (
                      <span className="italic text-red-500">No response was recorded</span>
                    ) : (
                      `"${response.answer}"`
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths and Improvements */}
        <div className="mb-6 grid gap-6 sm:mb-8 md:grid-cols-2">
          {/* Strengths */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Your Strengths
            </h3>
            <div className="space-y-4">
              {strengths.map((item, idx) => (
                <div key={idx} className="rounded-xl bg-green-500/5 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-green-500" />
                      <p className="font-medium text-foreground">{item.title}</p>
                    </div>
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-500">
                      {item.metric}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Areas for Improvement
            </h3>
            <div className="space-y-4">
              {improvements.length > 0 ? improvements.map((item, idx) => (
                <div key={idx} className="rounded-xl bg-amber-500/5 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-amber-500" />
                      <p className="font-medium text-foreground">{item.title}</p>
                    </div>
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-500">
                      {item.metric}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              )) : (
                <div className="rounded-xl bg-green-500/5 p-4 text-center">
                  <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                  <p className="mt-2 font-medium text-foreground">Excellent Performance!</p>
                  <p className="mt-1 text-sm text-muted-foreground">No significant areas for improvement detected.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button
            onClick={handleRetry}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-semibold text-foreground transition-all hover:bg-secondary sm:w-auto"
          >
            <RotateCcw className="h-5 w-5" />
            Practice Again
          </button>
          <button
            onClick={handleStartNew}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 sm:w-auto"
          >
            New Interview
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
