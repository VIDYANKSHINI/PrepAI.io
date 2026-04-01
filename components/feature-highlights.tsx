export function FeatureHighlights() {
  const features = [
    {
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Personalized Questions",
      description: "AI generates role-specific interview questions tailored to your target position",
    },
    {
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "Instant Feedback",
      description: "Get real-time analysis on your answers with scoring and improvement tips",
    },
    {
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Build Confidence",
      description: "Practice repeatedly to improve your communication skills and interview presence",
    },
  ]

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3 lg:gap-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="card-responsive flex flex-col items-start gap-2 rounded-lg border border-border/30 bg-card/50 p-4 transition-all hover:border-border/60 hover:bg-card/70 sm:gap-3 sm:p-4"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary sm:h-9 sm:w-9">
            {feature.icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground sm:text-base">{feature.title}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
