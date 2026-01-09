'use server'

import { generateScenario } from '@/lib/scenario-generator'
import { generateZip } from '@/lib/zip-generator'
import type { FormData, ScenarioData } from '@/types/scenario'

export async function generateScenarioAction(formData: FormData): Promise<{
  success: boolean
  data?: ScenarioData
  error?: string
}> {
  try {
    const scenario = await generateScenario(formData)
    return { success: true, data: scenario }
  } catch (error) {
    console.error('Scenario generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'シナリオ生成に失敗しました',
    }
  }
}

export async function generateZipAction(scenario: ScenarioData): Promise<{
  success: boolean
  data?: string // base64 encoded
  filename?: string
  error?: string
}> {
  try {
    const buffer = await generateZip(scenario)
    const base64 = buffer.toString('base64')
    const timestamp = new Date().toISOString().split('T')[0]
    const safeTitle = scenario.title.replace(/[<>:"/\\|?*]/g, '_')

    return {
      success: true,
      data: base64,
      filename: `${safeTitle}_${timestamp}.zip`,
    }
  } catch (error) {
    console.error('ZIP generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ZIP生成に失敗しました',
    }
  }
}
