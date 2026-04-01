"use client"
import { useState } from "react"

export function Round5Behavioral() {
  const [q, setQ] = useState(0)
  const [ans, setAns] = useState("")
  const [done, setDone] = useState(false)

  const qs = [
    "Tell me about yourself?",
    "Your biggest achievement?",
  ]

  if (done) return <h2>Interview Complete</h2>

  return (
    <div style={{ padding: 20 }}>
      <h3>Behavioral Round</h3>

      <p>{qs[q]}</p>

      <textarea
        value={ans}
        onChange={(e) => setAns(e.target.value)}
        rows={3}
        style={{ width: "100%" }}
      />

      <br /><br />

      <button
        onClick={() => {
          setAns("")
          if (q < qs.length - 1) setQ(q + 1)
          else setDone(true)
        }}
      >
        {q < qs.length - 1 ? "Next" : "Finish"}
      </button>
    </div>
  )
}