'use client'

import { useState, useRef } from 'react'
import { useInterview, type ResumeData } from '@/lib/interview-context'
import { RoundProgress } from '../round-progress'
import { PrepLogo } from '../prep-logo'
import { Upload, FileText, X, Loader2, CheckCircle, ArrowRight, ChevronRight } from 'lucide-react'

const basicQuestions = [
  "Tell me about yourself and your background.",
  "What are your key technical skills?",
  "Describe a project you're most proud of.",
  "Why are you interested in this role?",
  "What are your career goals?",
]

const mcqQuestions = [
  {
    question: "Which data structure would be most efficient for implementing a LRU cache?",
    options: ["Array", "LinkedList + HashMap", "Binary Tree", "Stack"],
    correct: 1,
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct: 1,
  },
  {
    question: "Which design pattern is used when you need only one instance of a class?",
    options: ["Factory", "Observer", "Singleton", "Decorator"],
    correct: 2,
  },
  {
    question: "What does REST stand for?",
    options: ["Remote Execution State Transfer", "Representational State Transfer", "Request State Transfer", "Resource State Transfer"],
    correct: 1,
  },
  {
    question: "Which HTTP method is idempotent?",
    options: ["POST", "PUT", "PATCH", "None of the above"],
    correct: 1,
  },
]

export function Round1Screening() {
  const { config, setConfig, setCurrentStep, setCurrentRound, updateRoundScore } = useInterview()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [stage, setStage] = useState<'resume' | 'basic' | 'mcq' | 'complete'>('resume')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [isParsingResume, setIsParsingResume] = useState(false)
  const [resumeError, setResumeError] = useState<string | null>(null)
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [basicAnswers, setBasicAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  
  const [mcqAnswers, setMcqAnswers] = useState<number[]>([])
  const [selectedMcq, setSelectedMcq] = useState<number | null>(null)

  const handleResumeUpload = async (file: File) => {
    if (!file.type.includes('pdf') && !file.type.includes('text')) {
      setResumeError('Please upload a PDF or text file')
      return
    }

    setResumeFile(file)
    setIsParsingResume(true)
    setResumeError(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to parse resume')

      const data = await response.json()
      setResumeData(data.resumeData)
      
      if (config) {
        setConfig({
          ...config,
          resumeData: data.resumeData,
          resumeText: data.rawText,
        })
      }
    } catch (error) {
      console.error('Error parsing resume:', error)
      setResumeError('Could not parse resume. You can still continue.')
    } finally {
      setIsParsingResume(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleResumeUpload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleResumeUpload(file)
  }

  const removeResume = () => {
    setResumeFile(null)
    setResumeData(null)
    setResumeError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleBasicNext = () => {
    if (currentAnswer.trim()) {
      setBasicAnswers([...basicAnswers, currentAnswer])
      setCurrentAnswer('')
      
      if (currentQuestion < basicQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setStage('mcq')
        setCurrentQuestion(0)
      }
    }
  }

  const handleBasicSkip = () => {
    setBasicAnswers([...basicAnswers, '']) // Store empty answer for skipped question
    setCurrentAnswer('')
    
    if (currentQuestion < basicQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setStage('mcq')
      setCurrentQuestion(0)
    }
  }

  const handleMcqNext = () => {
    if (selectedMcq !== null) {
      setMcqAnswers([...mcqAnswers, selectedMcq])
      setSelectedMcq(null)
      
      if (currentQuestion < mcqQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Calculate score and proceed
        const correctAnswers = mcqAnswers.concat(selectedMcq).filter(
          (ans, idx) => ans === mcqQuestions[idx].correct
        ).length
        
        updateRoundScore('screening', {
          score: (correctAnswers / mcqQuestions.length) * 100,
          maxScore: 100,
          feedback: `You answered ${correctAnswers} out of ${mcqQuestions.length} MCQs correctly.`,
          details: {
            mcqScore: (correctAnswers / mcqQuestions.length) * 100,
            basicQuestions: basicAnswers.length,
          },
        })
        
        setStage('complete')
      }
    }
  }

  const handleMcqSkip = () => {
    setMcqAnswers([...mcqAnswers, -1]) // Store -1 for skipped question (will never match correct answer)
    setSelectedMcq(null)
    
    if (currentQuestion < mcqQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate score and proceed (skipped questions count as wrong)
      const correctAnswers = mcqAnswers.concat(-1).filter(
        (ans, idx) => ans === mcqQuestions[idx].correct
      ).length
      
      updateRoundScore('screening', {
        score: (correctAnswers / mcqQuestions.length) * 100,
        maxScore: 100,
        feedback: `You answered ${correctAnswers} out of ${mcqQuestions.length} MCQs correctly.`,
        details: {
          mcqScore: (correctAnswers / mcqQuestions.length) * 100,
          basicQuestions: basicAnswers.length,
        },
      })
      
      setStage('complete')
    }
  }

  const proceedToNextRound = () => {
    setCurrentRound(2)
    setCurrentStep('round2-technical')
  }

  return (
    <div className="screen-container relative bg-background">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-green-500/5 blur-3xl"></div>
      </div>

      <div className="content-container relative z-10 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PrepLogo className="h-8 w-8" />
            <span className="text-xl font-bold text-foreground">Round 1: Screening</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {config?.name}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <RoundProgress />
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl">
          {stage === 'resume' && (
            <div className="space-y-6 rounded-xl border border-border bg-card p-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Upload Your Resume</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We&apos;ll analyze your resume to generate personalized questions
                </p>
              </div>

              {!resumeFile ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background p-12 transition-colors hover:border-primary hover:bg-primary/5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-lg font-medium text-foreground">Drop your resume here</p>
                  <p className="mt-1 text-sm text-muted-foreground">or click to browse (PDF supported)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${resumeData ? 'bg-green-500/20' : 'bg-primary/20'}`}>
                      {isParsingResume ? (
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      ) : resumeData ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <FileText className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{resumeFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {isParsingResume ? 'Analyzing...' : resumeData ? 'Parsed successfully' : 'Ready'}
                      </p>
                    </div>
                    <button onClick={removeResume} className="p-2 text-muted-foreground hover:text-foreground">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {resumeData && (
                    <div className="mt-4 space-y-3 border-t border-border pt-4">
                      <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Skills Detected</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {resumeData.skills.slice(0, 8).map((skill, i) => (
                            <span key={i} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      {resumeData.experience.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase text-muted-foreground">Experience</p>
                          <p className="mt-1 text-sm text-foreground">
                            {resumeData.experience[0].title} at {resumeData.experience[0].company}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {resumeError && <p className="text-sm text-amber-500">{resumeError}</p>}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setStage('basic')}
                  className="px-6 py-2 text-muted-foreground hover:text-foreground"
                >
                  Skip
                </button>
                <button
                  onClick={() => setStage('basic')}
                  disabled={isParsingResume}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {stage === 'basic' && (
            <div className="space-y-6 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Basic Questions</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {basicQuestions.length}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {currentQuestion + 1}/{basicQuestions.length}
                </div>
              </div>

              <div className="rounded-lg bg-background p-4">
                <p className="text-lg font-medium text-foreground">{basicQuestions[currentQuestion]}</p>
              </div>

              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={4}
                className="w-full rounded-lg border border-border bg-background p-4 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleBasicSkip}
                  className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-5 py-3 font-medium text-secondary-foreground hover:bg-secondary/80"
                >
                  Skip
                </button>
                <button
                  onClick={handleBasicNext}
                  disabled={!currentAnswer.trim()}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50"
                >
                  {currentQuestion < basicQuestions.length - 1 ? 'Next Question' : 'Continue to MCQs'}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {stage === 'mcq' && (
            <div className="space-y-6 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Aptitude Test</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {mcqQuestions.length}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {currentQuestion + 1}/{mcqQuestions.length}
                </div>
              </div>

              <div className="rounded-lg bg-background p-4">
                <p className="text-lg font-medium text-foreground">{mcqQuestions[currentQuestion].question}</p>
              </div>

              <div className="space-y-3">
                {mcqQuestions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedMcq(idx)}
                    className={`w-full rounded-lg border p-4 text-left transition-all ${
                      selectedMcq === idx
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleMcqSkip}
                  className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-5 py-3 font-medium text-secondary-foreground hover:bg-secondary/80"
                >
                  Skip
                </button>
                <button
                  onClick={handleMcqNext}
                  disabled={selectedMcq === null}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50"
                >
                  {currentQuestion < mcqQuestions.length - 1 ? 'Next' : 'Submit'}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {stage === 'complete' && (
            <div className="space-y-6 rounded-xl border border-border bg-card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Round 1 Complete!</h2>
                <p className="mt-2 text-muted-foreground">
                  Great job! You&apos;ve completed the screening round.
                </p>
              </div>
              <button
                onClick={proceedToNextRound}
                className="mx-auto flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground hover:brightness-110"
              >
                Proceed to Round 2: Technical
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
