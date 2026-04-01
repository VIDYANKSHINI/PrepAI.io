'use client'

import { useState } from 'react'
import { PrepLogo } from './prep-logo'
import { AuthModal } from './auth-modal'
import { ArrowRight, Play, CheckCircle2, Zap, BarChart3, Users, Menu, X } from 'lucide-react'

function Navbar({ onGetStarted }: { onGetStarted: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur-xl">
      <div className="content-container">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <PrepLogo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              PrepAI<span className="text-primary">.io</span>
            </span>
          </div>

          {/* Navigation links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
          </div>

          {/* CTA - Desktop */}
          <div className="hidden sm:flex items-center gap-4">
            <button 
              onClick={onGetStarted}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={onGetStarted}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 shadow-lg shadow-primary/20"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="sm:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-4 border-t border-border/40">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How it Works
              </a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/40">
                <button 
                  onClick={() => { onGetStarted(); setMobileMenuOpen(false); }}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Log in
                </button>
                <button 
                  onClick={() => { onGetStarted(); setMobileMenuOpen(false); }}
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function StatsSection() {
  const stats = [
    { value: '10K+', label: 'Interviews Practiced' },
    { value: '94%', label: 'Success Rate' },
    { value: '50+', label: 'Partner Companies' },
    { value: '4.9/5', label: 'User Rating' },
  ]

  return (
    <section className="border-y border-border/40 bg-card/50">
      <div className="content-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'AI-Powered Questions',
      description: 'Get personalized interview questions tailored to your target role, experience level, and industry.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Real-time Feedback',
      description: 'Receive instant analysis on your answers with scoring, improvement tips, and detailed insights.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: '5-Round Simulation',
      description: 'Practice all interview stages: screening, technical, live coding, system design, and behavioral.',
    },
  ]

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="content-container">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to ace your interview
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive interview preparation with real-time feedback and personalized coaching.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    { step: '01', title: 'Set Up Your Profile', description: 'Upload your resume and select your target role and difficulty level.' },
    { step: '02', title: 'Practice Interviews', description: 'Go through realistic interview rounds with our AI interviewer.' },
    { step: '03', title: 'Get Detailed Feedback', description: 'Receive comprehensive analysis and actionable improvement tips.' },
    { step: '04', title: 'Track Progress', description: 'Monitor your improvement over time with detailed analytics.' },
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-card/30 border-y border-border/40">
      <div className="content-container">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Start practicing in minutes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process gets you from signup to your first practice interview in under 2 minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              <div className="text-5xl font-bold text-border mb-4">{item.step}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-border/50 -translate-x-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "PrepAI helped me land my dream job at a FAANG company. The AI feedback was incredibly detailed and helped me identify my weak points.",
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      initials: "SC",
    },
    {
      quote: "I went from failing technical interviews to receiving multiple offers. The live coding practice was a game-changer for my preparation.",
      name: "Michael Park",
      role: "Senior Developer at Meta",
      initials: "MP",
    },
    {
      quote: "The behavioral interview practice helped me structure my answers using the STAR method. Highly recommend for anyone preparing for interviews.",
      name: "Emily Rodriguez",
      role: "Product Manager at Amazon",
      initials: "ER",
    },
  ]

  return (
    <section id="testimonials" className="py-20 md:py-28">
      <div className="content-container">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by thousands of job seekers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what our users have to say about their experience with PrepAI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-20 md:py-28 bg-card/30 border-t border-border/40">
      <div className="content-container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to ace your next interview?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of successful candidates who have used PrepAI to land their dream jobs.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
          >
            Start Your Free Interview
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required. Start practicing in minutes.
          </p>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-12">
      <div className="content-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <PrepLogo className="h-6 w-6 text-foreground" />
            <span className="text-lg font-bold text-foreground">PrepAI.io</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <p className="text-sm text-muted-foreground">
            2026 PrepAI.io. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export function HeroSection() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleGetStarted = () => {
    setIsAuthModalOpen(true)
  }

  return (
    <>
      <Navbar onGetStarted={handleGetStarted} />
      
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-background relative overflow-hidden min-h-screen flex items-center">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/images/video-poster.jpg"
          >
            {/* Replace this URL with your own video */}
            <source src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
        </div>

        {/* Gradient accent */}
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <div
            className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 opacity-20"
            style={{
              background: "radial-gradient(ellipse at center, hsl(211 100% 55%), transparent 70%)",
            }}
          />
        </div>

        <div className="content-container relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-1.5 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-full w-full rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-muted-foreground">AI-Powered Interview Prep</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              <span className="text-balance">
                Master Your Interviews with AI
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Practice realistic interview rounds, get instant AI feedback, and build the confidence to land your dream job.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
              >
                Start Your Free Interview
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-6 py-4 text-lg font-medium text-foreground transition-all hover:bg-card">
                <Play className="h-5 w-5" />
                Watch Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                5 interview rounds
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Instant AI feedback
              </span>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection onGetStarted={handleGetStarted} />
      <Footer />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
