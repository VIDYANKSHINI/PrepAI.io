import { generateText, Output } from 'ai'
import { z } from 'zod'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('resume') as File
  
  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 })
  }

  // Extract text from PDF using a simple approach
  // In production, you'd use a proper PDF parser like pdf-parse
  const arrayBuffer = await file.arrayBuffer()
  const text = await extractTextFromPDF(arrayBuffer)

  // Use AI to structure the resume data
  const result = await generateText({
    model: 'openai/gpt-4o-mini',
    output: Output.object({
      schema: z.object({
        name: z.string().nullable(),
        email: z.string().nullable(),
        phone: z.string().nullable(),
        summary: z.string().nullable(),
        skills: z.array(z.string()),
        experience: z.array(z.object({
          title: z.string(),
          company: z.string(),
          duration: z.string().nullable(),
          description: z.string().nullable(),
        })),
        education: z.array(z.object({
          degree: z.string(),
          institution: z.string(),
          year: z.string().nullable(),
        })),
        projects: z.array(z.object({
          name: z.string(),
          description: z.string().nullable(),
          technologies: z.array(z.string()),
        })),
        suggestedQuestions: z.array(z.string()),
      }),
    }),
    prompt: `Parse this resume and extract structured information. Also generate 5 personalized interview questions based on the candidate's experience and skills.

Resume text:
${text}

Extract all relevant information and generate thoughtful interview questions that probe deeper into their experience.`,
  })

  return Response.json({
    resumeData: result.output,
    rawText: text,
  })
}

async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  // Simple PDF text extraction
  // This is a basic implementation - in production use pdf-parse or similar
  const uint8Array = new Uint8Array(arrayBuffer)
  let text = ''
  
  // Try to extract readable text from PDF
  const decoder = new TextDecoder('utf-8', { fatal: false })
  const rawText = decoder.decode(uint8Array)
  
  // Extract text between parentheses (common PDF text format)
  const matches = rawText.match(/\(([^)]+)\)/g)
  if (matches) {
    text = matches
      .map(m => m.slice(1, -1))
      .filter(t => t.length > 1 && !/^[\\\/\d]+$/.test(t))
      .join(' ')
  }
  
  // If we couldn't extract much, return a placeholder
  if (text.length < 50) {
    // For demo purposes, return placeholder text
    text = rawText.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim()
  }
  
  return text.slice(0, 5000) // Limit to 5000 chars
}
