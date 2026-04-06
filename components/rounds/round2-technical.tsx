'use client'

import { useState, useEffect, useCallback } from 'react'
import { useInterview } from '@/lib/interview-context'
import { RoundProgress } from '../round-progress'
import { PrepLogo } from '../prep-logo'
import { Play, RotateCcw, Send, Clock, CheckCircle, ArrowRight, Code2 } from 'lucide-react'

const codingProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
    starterCode: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
    testCases: [
      { input: [[2,7,11,15], 9], expected: [0, 1] },
      { input: [[3,2,4], 6], expected: [1, 2] },
      { input: [[3,3], 6], expected: [0, 1] },
    ],
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: "true", explanation: "" },
      { input: 's = "()[]{}"', output: "true", explanation: "" },
      { input: 's = "(]"', output: "false", explanation: "" },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'"],
    starterCode: `function isValid(s) {
  // Write your solution here
  
}`,
    testCases: [
      { input: ["()"], expected: true },
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false },
    ],
  },
]

export function Round2Technical() {
  const { config, setCurrentStep, setCurrentRound, updateRoundScore } = useInterview()
  
  const [currentProblem, setCurrentProblem] = useState(0)
  const [code, setCode] = useState(codingProblems[0].starterCode)
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes
  const [testResults, setTestResults] = useState<{passed: boolean; message: string}[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [problemScores, setProblemScores] = useState<number[]>([])

  const problem = codingProblems[currentProblem]

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 || isComplete) return
    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, isComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const runCode = useCallback(() => {
    setIsRunning(true)
    setOutput('')
    setTestResults([])

    setTimeout(() => {
      try {
        // Simple evaluation (in production, use a sandbox)
        const results: {passed: boolean; message: string}[] = []
        let passedCount = 0

        problem.testCases.forEach((testCase, idx) => {
          try {
            // Create a function from the code
            const funcMatch = code.match(/function\s+(\w+)/)
            if (!funcMatch) {
              results.push({ passed: false, message: `Test ${idx + 1}: Could not find function` })
              return
            }

            const evalCode = `${code}; ${funcMatch[1]}(...${JSON.stringify(testCase.input)})`
            const result = eval(evalCode)
            
            const passed = JSON.stringify(result) === JSON.stringify(testCase.expected)
            if (passed) passedCount++
            
            results.push({
              passed,
              message: `Test ${idx + 1}: ${passed ? 'Passed' : `Failed - Expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(result)}`}`,
            })
          } catch (error) {
            results.push({
              passed: false,
              message: `Test ${idx + 1}: Runtime Error - ${(error as Error).message}`,
            })
          }
        })

        setTestResults(results)
        setOutput(`Passed ${passedCount}/${problem.testCases.length} test cases`)
      } catch (error) {
        setOutput(`Error: ${(error as Error).message}`)
      } finally {
        setIsRunning(false)
      }
    }, 1000)
  }, [code, problem])

  const handleSubmit = () => {
    runCode()
    
    // Calculate score for this problem
    const passedTests = testResults.filter(t => t.passed).length
    const score = (passedTests / problem.testCases.length) * 100
    
    setProblemScores([...problemScores, score])
    
    if (currentProblem < codingProblems.length - 1) {
      setTimeout(() => {
        setCurrentProblem(currentProblem + 1)
        setCode(codingProblems[currentProblem + 1].starterCode)
        setOutput('')
        setTestResults([])
      }, 1500)
    } else {
      // All problems done
      const avgScore = [...problemScores, score].reduce((a, b) => a + b, 0) / codingProblems.length
      updateRoundScore('technical', {
        score: avgScore,
        maxScore: 100,
        feedback: `Completed ${codingProblems.length} coding problems with an average score of ${avgScore.toFixed(0)}%.`,
        details: {
          problemsSolved: codingProblems.length,
          averageScore: avgScore,
          timeUsed: (30 * 60 - timeLeft) / 60,
        },
      })
      setIsComplete(true)
    }
  }

  const resetCode = () => {
    setCode(problem.starterCode)
    setOutput('')
    setTestResults([])
  }

  const proceedToNextRound = () => {
    setCurrentRound(3)
    setCurrentStep('round3-livecoding')
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
              <h2 className="text-2xl font-bold text-foreground">Round 2 Complete!</h2>
              <p className="mt-2 text-muted-foreground">
                You&apos;ve completed the technical coding round.
              </p>
            </div>
            <button
              onClick={proceedToNextRound}
              className="mx-auto flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground hover:brightness-110"
            >
              Proceed to Round 3: Live Coding
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
                <h1 className="font-bold text-foreground">Round 2: Technical Coding</h1>
                <p className="text-xs text-muted-foreground">
                  Problem {currentProblem + 1} of {codingProblems.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${
                timeLeft < 300 ? 'bg-red-500/20 text-red-500' : 'bg-primary/10 text-primary'
              }`}>
                <Clock className="h-4 w-4" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <RoundProgress />
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Problem description */}
          <div className="w-1/2 overflow-y-auto border-r border-border p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-500' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {problem.difficulty}
                </span>
                <h2 className="text-xl font-bold text-foreground">{problem.title}</h2>
              </div>

              <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                {problem.description}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Examples:</h3>
                {problem.examples.map((ex, idx) => (
                  <div key={idx} className="rounded-lg bg-secondary/50 p-4">
                    <p className="text-sm"><span className="font-medium text-foreground">Input:</span> <code className="text-primary">{ex.input}</code></p>
                    <p className="mt-1 text-sm"><span className="font-medium text-foreground">Output:</span> <code className="text-green-500">{ex.output}</code></p>
                    {ex.explanation && (
                      <p className="mt-1 text-sm text-muted-foreground">{ex.explanation}</p>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold text-foreground">Constraints:</h3>
                <ul className="mt-2 space-y-1">
                  {problem.constraints.map((c, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      <code className="text-primary">{c}</code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Code editor */}
          <div className="flex w-1/2 flex-col">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">JavaScript</span>
              </div>
              <button
                onClick={resetCode}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>

            {/* Code area */}
            <div className="flex-1 overflow-hidden">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-full w-full resize-none bg-[#1e1e2e] p-4 font-mono text-sm text-white focus:outline-none"
                spellCheck={false}
              />
            </div>

            {/* Output panel */}
            <div className="h-48 border-t border-border bg-[#1e1e2e]">
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-2">
                <span className="text-sm font-medium text-white/70">Output</span>
                <div className="flex gap-2">
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-1.5 text-sm font-medium text-foreground hover:bg-secondary/80 disabled:opacity-50"
                  >
                    <Play className="h-4 w-4" />
                    Run
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isRunning}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    Submit
                  </button>
                </div>
              </div>
              <div className="h-32 overflow-y-auto p-4">
                {isRunning ? (
                  <p className="text-sm text-white/50">Running...</p>
                ) : (
                  <>
                    {output && <p className="text-sm text-white">{output}</p>}
                    {testResults.map((result, idx) => (
                      <p key={idx} className={`text-sm ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                        {result.message}
                      </p>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
