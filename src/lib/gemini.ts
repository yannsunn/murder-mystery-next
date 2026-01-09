import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

const MODELS = [
  'gemini-2.5-flash-preview-05-20',
  'gemini-2.0-flash-lite',
  'gemma-2-27b-it',
] as const

interface GenerateOptions {
  maxTokens?: number
  temperature?: number
}

async function tryGenerate(
  modelName: string,
  systemPrompt: string,
  userPrompt: string,
  options: GenerateOptions
): Promise<string | null> {
  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
    })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        maxOutputTokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
      },
    })

    const text = result.response.text()
    if (text) return text
    return null
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.includes('429') || message.includes('quota') || message.includes('rate')) {
      return null
    }
    throw error
  }
}

export async function generateWithAI(
  systemPrompt: string,
  userPrompt: string,
  options: GenerateOptions = {}
): Promise<string> {
  for (const modelName of MODELS) {
    const result = await tryGenerate(modelName, systemPrompt, userPrompt, options)
    if (result) return result
  }
  throw new Error('すべてのモデルでレート制限に達しました。しばらく待ってから再試行してください。')
}
