# PrepAI.io - AI-Powered Interview Practice Platform

PrepAI.io is a comprehensive, real-time AI interview practice platform that helps users master their interviews through voice-first AI conversations, video analysis, and detailed behavioral feedback.

## Features

### Core Functionality

- **Voice-First AI Interviews** - Natural conversation with < 2 second latency using Web Speech API for speech recognition and synthesis
- **Real-Time Video Analysis** - Live webcam feed with behavioral metrics tracking
- **Resume Parsing** - Upload PDF resumes for AI-generated custom interview questions
- **Multi-Type Interviews** - Support for HR and Technical interview formats
- **5-Question Sessions** - Structured interview flow with skip/next navigation

### AI Interviewer

- Professional AI interviewer avatar ("Sarah") that speaks questions aloud
- Natural female voice synthesis with multiple voice options
- Visual speaking indicator when AI is talking
- Smooth question transitions with audio feedback

### Behavioral Analysis

Real-time tracking and analysis of:

- **Eye Contact** - Camera-based gaze detection
- **Posture Analysis** - Body positioning and professionalism
- **Facial Expressions** - Confidence, happiness, neutrality, nervousness breakdown
- **Speaking Pace** - Words per minute analysis
- **Fluency Score** - Natural speech flow measurement
- **Filler Words** - Detection and counting of "um", "uh", "like", etc.
- **Response Time** - Per-question timing metrics

### Input Methods

- **Voice Input** - Continuous speech recognition with live transcript
- **Text Input** - Fallback textarea for typing responses
- **Combined Mode** - Both methods work together, with speech syncing to text

### Results & Analysis

#### Summary Screen
- Overall score (0-100) with visual progress ring
- Individual scores: Communication, Content Quality, Confidence
- Interview statistics: Duration, Questions Answered, Type, Role

#### Detailed Analysis Screen
- Key stats: Total Duration, Words Spoken, Average Response Time, Filler Word Count
- Behavioral metrics with progress bars
- Facial expression breakdown chart
- Question-by-question transcript with duration and word count
- Personalized strengths and improvement recommendations

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui
- **Fonts**: Inter (body), Space Grotesk (display)
- **APIs**: 
  - Web Speech API (speech recognition & synthesis)
  - MediaDevices API (camera/microphone access)
  - AI SDK for resume parsing

## Project Structure

```
app/
├── api/
│   ├── interview/          # AI conversation endpoint
│   │   └── route.ts
│   └── parse-resume/       # Resume parsing endpoint
│       └── route.ts
├── globals.css             # Global styles and design tokens
├── layout.tsx              # Root layout with fonts
└── page.tsx                # Main page with step routing

components/
├── feature-highlights.tsx  # Landing page features grid
├── hero-section.tsx        # Landing page hero
├── interview-analysis.tsx  # Detailed analysis view
├── interview-results.tsx   # Results summary view
├── interview-session.tsx   # Live interview UI
├── interview-setup.tsx     # Interview configuration form
└── prep-logo.tsx           # Brand logo component

lib/
├── interview-context.tsx   # React context for interview state
└── utils.ts                # Utility functions

public/
└── images/
    ├── ai-interviewer.jpg  # AI avatar image
    └── dashboard-preview.jpg # Hero section preview image
```

## Application Flow

1. **Home** (`/`) - Landing page with value proposition and CTA
2. **Setup** - Configure interview: name, role, type, permissions, optional resume upload
3. **Live Interview** - 5-question AI interview with camera/mic
4. **Results** - Score summary with option to view detailed analysis
5. **Analysis** - In-depth behavioral feedback and recommendations

## Key Components

### InterviewContext

Central state management for the entire interview flow:

```typescript
interface InterviewContextType {
  config: InterviewConfig | null          // Interview settings
  currentStep: 'home' | 'setup' | 'live' | 'results' | 'analysis'
  results: InterviewResults | null        // Final scores and data
}
```

### InterviewConfig

```typescript
interface InterviewConfig {
  name: string
  role: string
  interviewType: 'HR' | 'Technical'
  microphoneEnabled: boolean
  cameraEnabled: boolean
  resumeData?: ResumeData
  resumeText?: string
}
```

### BehavioralMetrics

```typescript
interface BehavioralMetrics {
  eyeContact: number
  facialExpressions: {
    neutral: number
    happy: number
    confident: number
    nervous: number
  }
  posture: number
  speakingPace: number
  fluency: number
  fillerWords: number
  responseTime: number[]
}
```

## Responsive Design

The application is fully responsive with:

- `screen-container` - Full viewport height, no horizontal overflow
- `content-container` - Max-width 1280px with responsive padding
- `video-responsive` - 16:9 aspect ratio for video elements
- Mobile-first breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)

## Color Scheme

Dark theme with 4 primary colors:

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--background` | 225 15% 10% | Main background |
| `--foreground` | 0 0% 98% | Primary text |
| `--primary` | 211 100% 55% | Blue accent |
| `--muted-foreground` | 220 10% 60% | Secondary text |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd prepai

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## Browser Compatibility

Requires browsers with support for:

- Web Speech API (Chrome, Edge recommended)
- MediaDevices API (getUserMedia)
- ES2020+ JavaScript features

## Usage

1. Click "Start Your Free Interview" on the landing page
2. Fill in your details and optionally upload a resume
3. Grant camera and microphone permissions
4. Click "Start Interview" to begin
5. Answer questions using voice or text input
6. Use Skip to pass questions or Next to continue
7. View your results and detailed analysis
8. Practice again or start a new interview

## Performance Optimizations

- Image optimization with Next.js Image component
- Lazy loading of analysis components
- Efficient re-renders with React Context
- Responsive image sizing with srcset

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatible
- Color contrast compliant

## License

MIT License - See LICENSE file for details.

---

Built with Next.js, Tailwind CSS, and AI SDK by the PrepAI.io team.
