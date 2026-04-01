"use client"
import { useState } from "react"

export function Round1Screening() {
  const [stage, setStage] = useState("resume")
  const [q, setQ] = useState(0)
  const [ans, setAns] = useState("")
  const [sel, setSel] = useState<number | null>(null)

  const bq = ["Tell me about yourself?", "Your skills?"]
  const mq = [{ q: "Binary search complexity?", o: ["O(n)", "O(log n)", "O(n2)", "O(1)"], a: 1 }]

  return (
    <div style={{ padding: 20 }}>
      
      {stage === "resume" && (
        <div>
          <h3>Upload Resume</h3>
          <input type="file" />
          <br /><br />
          <button onClick={() => setStage("basic")}>Next</button>
        </div>
      )}

      {stage === "basic" && (
        <div>
          <p>{bq[q]}</p>
          <input value={ans} onChange={(e) => setAns(e.target.value)} />
          <br /><br />
          <button
            onClick={() => {
              setAns("")
              if (q < bq.length - 1) setQ(q + 1)
              else {
                setStage("mcq")
                setQ(0)
              }
            }}
          >
            Next
          </button>
        </div>
      )}

      {stage === "mcq" && (
        <div>
          <p>{mq[0].q}</p>
          {mq[0].o.map((x, i) => (
            <button key={i} onClick={() => setSel(i)} style={{ display: "block", margin: 5 }}>
              {x}
            </button>
          ))}
          <button disabled={sel === null} onClick={() => setStage("done")}>
            Submit
          </button>
        </div>
      )}

      {stage === "done" && <h2>Round 1 Complete</h2>}
    </div>
  )
}