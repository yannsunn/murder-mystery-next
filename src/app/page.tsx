'use client'

import { useState } from 'react'
import { ScenarioForm } from '@/components/ScenarioForm'
import { ScenarioResult } from '@/components/ScenarioResult'
import { LoadingState } from '@/components/LoadingState'
import { generateScenarioAction } from '@/actions/generate'
import type { FormData, ScenarioData } from '@/types/scenario'

type AppState = 'form' | 'loading' | 'result' | 'error'

export default function Home() {
  const [state, setState] = useState<AppState>('form')
  const [scenario, setScenario] = useState<ScenarioData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleGenerate = async (formData: FormData) => {
    setState('loading')
    setProgress(0)
    setError(null)

    // 進捗シミュレーション（実際のAPIは段階的に進行）
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 5, 90))
    }, 2000)

    try {
      const result = await generateScenarioAction(formData)

      clearInterval(progressInterval)

      if (result.success && result.data) {
        setProgress(100)
        setScenario(result.data)
        setState('result')
      } else {
        throw new Error(result.error || '生成に失敗しました')
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました')
      setState('error')
    }
  }

  const handleReset = () => {
    setState('form')
    setScenario(null)
    setError(null)
    setProgress(0)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Murder Mystery</h1>
          <p className="text-gray-400">Professional Scenario Synthesis System</p>
        </header>

        {state === 'form' && <ScenarioForm onSubmit={handleGenerate} />}

        {state === 'loading' && <LoadingState progress={progress} />}

        {state === 'result' && scenario && (
          <ScenarioResult scenario={scenario} onReset={handleReset} />
        )}

        {state === 'error' && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-4">エラーが発生しました</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="bg-white text-black px-6 py-3 rounded font-medium hover:bg-gray-200 transition"
            >
              最初からやり直す
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
