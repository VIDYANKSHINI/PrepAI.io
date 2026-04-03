'use client'

import { useState, useEffect, useCallback } from 'react'
import { useInterview } from '@/lib/interview-context'
import { RoundProgress } from '../round-progress'
import { PrepLogo } from '../prep-logo'
import { Play, RotateCcw, Send, Clock, CheckCircle, ArrowRight, Code2 } from 'lucide-react'

const codingProblems = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: '' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    starterCode: `function twoSum(nums, target) {
  // Write your solution here
}`,
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] },
    ],
  },
  {
    id: 2,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true', explanation: '' },
      { input: 's = "()[]{}"', output: 'true', explanation: '' },
      { input: 's = "(]"', output: 'false', explanation: '' },
    ],
    constraints: ['1 <= s.length <= 10^4', "s consists of parentheses only '()[]{}'"],
    starterCode: `function isValid(s) {
  // Write your solution here
}`,
    testCases: [
      { input: ['()'], expected: true },
      { input: ['()[]{}'], expected: true },
      { input: ['(]'], expected: false },
    ],
  },
]

export function Round2Technical() {
  const { setCurrentStep, setCurrentRound, updateRoundScore } = useInterview()

  const [currentProblem, setCurrentProblem] = useState(0)
  const [code, setCode] = useState(codingProblems[0].starterCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30 * 60)
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [problemScores, setProblemScores] = useState<number[]>([])

  const problem = codingProblems[currentProblem]

  useEffect(() => {
    if (timeLeft <= 0 || isComplete) return
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000)
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
        const results: { passed: boolean; message: string }[] = []
        let passedCount = 0
        const funcMatch = code.match(/function\s+(\w+)/)

        if (!funcMatch) {
          setOutput('No function found')
          setTestResults([{ passed: false, message: 'Could not find function' }])
          setIsRunning(false)
          return
        }

        const functionName = funcMatch[1]

        problem.testCases.forEach((testCase, idx) => {
          try {
            const evalCode = `${code}; ${functionName}(...${JSON.stringify(testCase.input)})`
            const result = eval(evalCode)
            const passed = JSON.stringify(result) === JSON.stringify(testCase.expected)
            if (passed) passedCount++
            results.push({
              passed,
              message: `Test ${idx + 1}: ${passed ? 'Passed' : `Failed (expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(result)})`}`,
            })
          } catch (error) {
            results.push({
              passed: false,
              message: `Test ${idx + 1}: Runtime Error - ${(error as Error).message}`,
            })
          }
        })

        setTestResults(results)
        setOutput(`Passed ${passedCount}/${problem.testCases.length}`)
      } catch (error) {
        setOutput(`Error: ${(error as Error).message}`)
      } finally {
        setIsRunning(false)
      }
    }, 1000)
  }, [code, problem])

  const handleSubmit = () => {
    runCode()
    const passedTests = testResults.filter((t) => t.passed).length
    const score = (passedTests / problem.testCases.length) * 100
    const nextScores = [...problemScores, score]
    setProblemScores(nextScores)

    if (currentProblem < codingProblems.length - 1) {
      setTimeout(() => {
        const next = currentProblem + 1
        setCurrentProblem(next)
        setCode(codingProblems[next].starterCode)
        setOutput('')
        setTestResults([])
      }, 1500)
      return
    }

    const avgScore = nextScores.reduce((a, b) => a + b, 0) / codingProblems.length
    updateRoundScore('technical', {
      score: avgScore,
      maxScore: 100,
      feedback: `Completed ${codingProblems.length} problems with average ${avgScore.toFixed(0)}%.`,
      details: { problemsSolved: codingProblems.length, averageScore: avgScore, timeUsed: (30 * 60 - timeLeft) / 60 },
    })
    setIsComplete(true)
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
      <div>
        <h2>Round 2 Complete!</h2>
        <p>You&apos;ve completed the technical coding round.</p>
        <button onClick={proceedToNextRound}>Proceed to Round 3: Live Coding</button>
      </div>
    )
  }

  return (
    <div>
      <header>
        <div>
          <PrepLogo />
          <h1>Round 2: Technical Coding</h1>
          <p>Problem {currentProblem + 1} of {codingProblems.length}</p>
        </div>
        <div>
          <Clock />
          <span>{formatTime(timeLeft)}</span>
        </div>
        <div><RoundProgress /></div>
      </header>

      <main style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
        <section style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          <h2>{problem.title}</h2>
          <p>Difficulty: {problem.difficulty}</p>
          <p>{problem.description}</p>

          <h3>Examples</h3>
          {problem.examples.map((ex, idx) => (
            <div key={idx}>
              <p>Input: {ex.input}</p>
              <p>Output: {ex.output}</p>
              {ex.explanation && <p>Note: {ex.explanation}</p>}
            </div>
          ))}

          <h3>Constraints</h3>
          <ul>
            {problem.constraints.map((c, idx) => <li key={idx}>{c}</li>)}
          </ul>
        </section>

        <section style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div>
            <Code2 />
            <span>JavaScript</span>
            <button onClick={resetCode}><RotateCcw /> Reset</button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ flex: 1, width: '100%', fontFamily: 'monospace', padding: 12 }}
          />

          <div style={{ borderTop: '1px solid #ccc', padding: 12 }}>
            <div>
              <span>Output</span>
              <button onClick={runCode} disabled={isRunning}><Play /> Run</button>
              <button onClick={handleSubmit} disabled={isRunning}><Send /> Submit</button>
            </div>
            <div>
              {isRunning ? (
                <p>Running...</p>
              ) : (
                <>
                  {!!output && <p>{output}</p>}
                  {testResults.map((result, idx) => (
                    <p key={idx}>{result.message}</p>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}