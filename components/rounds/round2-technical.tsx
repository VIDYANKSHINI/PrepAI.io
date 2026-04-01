"use client"
import { useState } from "react"

export function Round2Technical() {
  const [code, setCode] = useState("function twoSum(nums,target){return [0,1]}")
  const [out, setOut] = useState("")
  const [done, setDone] = useState(false)

  const run = () => {
    try {
      const res = eval(code + "; twoSum([2,7,11,15],9)")
      setOut(JSON.stringify(res))
    } catch (e: any) {
      setOut(e.message)
    }
  }

  if (done) return <h2>Round 2 Complete</h2>

  return (
    <div style={{ padding: 20 }}>
      <h3>Technical Round</h3>

      <textarea
        rows={10}
        style={{ width: "100%" }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <br /><br />

      <button onClick={run}>Run</button>
      <button onClick={() => setDone(true)}>Submit</button>

      <pre>{out}</pre>
    </div>
  )
}