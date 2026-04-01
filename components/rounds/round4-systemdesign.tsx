"use client"
import { useState } from "react"

export function Round4SystemDesign() {
  const [items, setItems] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [done, setDone] = useState(false)

  if (done) return <h2>Round 4 Complete</h2>

  return (
    <div style={{ padding: 20 }}>
      <h3>System Design</h3>

      <input
        placeholder="Add component (e.g. DB, API)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={() => {
          if (input) {
            setItems([...items, input])
            setInput("")
          }
        }}
      >
        Add
      </button>

      <ul>
        {items.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>

      <button onClick={() => setDone(true)}>Submit</button>
    </div>
  )
}