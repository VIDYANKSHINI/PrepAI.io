"use client"
import { useState } from "react"

export function Round3LiveCoding() {
  const [code, setCode] = useState("function reverse(){return 'done'}")
  const [out, setOut] = useState("")
  const [start, setStart] = useState(false)
  const [done, setDone] = useState(false)

  const run = () => {
    try {
      const res = eval(code + "; reverse()")
      setOut(res)
    } catch (e: any) {
      setOut(e.message)
    }
  }

  if (done) return <h2>Round 3 Complete</h2>

  return (
    <div style={{ padding: 20 }}>
      
      {!start && (
        <button onClick={() => setStart(true)}>Start</button>
      )}

      {start && (
        <>
          <h3>Live Coding</h3>

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
        </>
      )}
    </div>
  )
}