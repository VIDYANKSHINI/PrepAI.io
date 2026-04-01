'use client'

import { useInterview } from "@/lib/interview-context"
import { Check } from 'lucide-react'

const rounds = [
  { id: 1, name: 'Screening', step: 'round1-screening' },
  { id: 2, name: 'Technical', step: 'round2-technical' },
  { id: 3, name: 'Live Coding', step: 'round3-livecoding' },
  { id: 4, name: 'System Design', step: 'round4-systemdesign' },
  { id: 5, name: 'Behavioral', step: 'round5-behavioral' },
]

export function RoundProgress() {
  const { currentRound } = useInterview()

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {rounds.map((round, index) => (
          <div key={round.id} className="flex flex-1 items-center">
            {/* Circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all sm:h-10 sm:w-10 sm:text-sm ${
                  currentRound > round.id
                    ? 'bg-green-500 text-white'
                    : currentRound === round.id
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {currentRound > round.id ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  round.id
                )}
              </div>
              <span
                className={`mt-2 text-center text-[10px] font-medium sm:text-xs ${
                  currentRound >= round.id ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {round.name}
              </span>
            </div>

            {/* Connecting line */}
            {index < rounds.length - 1 && (
              <div className="mx-1 h-1 flex-1 rounded-full sm:mx-2">
                <div
                  className={`h-full rounded-full transition-all ${
                    currentRound > round.id ? 'bg-green-500' : 'bg-secondary'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
