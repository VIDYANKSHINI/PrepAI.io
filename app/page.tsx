'use client'

import { InterviewProvider, useInterview } from "@/lib/interview-context"
import { HeroSection } from "@/components/hero-section"
import { InterviewSetup } from "@/components/interview-setup"
import { Round1Screening } from "@/components/rounds/round1-screening"
import { Round2Technical } from "@/components/rounds/round2-technical"
import { Round3LiveCoding } from "@/components/rounds/round3-livecoding"
import { Round4SystemDesign } from "@/components/rounds/round4-systemdesign"
import { Round5Behavioral } from "@/components/rounds/round5-behavioral"
import { FinalEvaluation } from "@/components/final-evaluation"

function PageContent() {
  const { currentStep } = useInterview()

  return (
    <main>
      {currentStep === 'home' && <HeroSection />}
      {currentStep === 'setup' && <InterviewSetup />}
      {currentStep === 'round1-screening' && <Round1Screening />}
      {currentStep === 'round2-technical' && <Round2Technical />}
      {currentStep === 'round3-livecoding' && <Round3LiveCoding />}
      {currentStep === 'round4-systemdesign' && <Round4SystemDesign />}
      {currentStep === 'round5-behavioral' && <Round5Behavioral />}
      {currentStep === 'results' && <FinalEvaluation />}
    </main>
  )
}

export default function Page() {
  return (
    <InterviewProvider>
      <PageContent />
    </InterviewProvider>
  )
}
