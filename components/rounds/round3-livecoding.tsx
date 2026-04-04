'use client'

import { useState } from 'react'

const problem = {
  title: "Reverse a Linked List",
  description: "Reverse a singly linked list."
}

export function Round3LiveCoding() {
  const [code, setCode] = useState('')

  return (
    <div className="h-screen flex">
      {/* Left */}
      <div className="w-1/2 p-4 bg-gray-900 text-white">
        <h2 className="text-xl font-bold">{problem.title}</h2>
        <p className="mt-2 text-sm">{problem.description}</p>
      </div>

      {/* Right */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-1/2 p-4 bg-black text-white"
      />
    </div>
  )
}