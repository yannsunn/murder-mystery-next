'use client'

interface LoadingStateProps {
  progress: number
}

const stages = [
  { threshold: 0, label: 'シナリオ構造を設計中...' },
  { threshold: 15, label: '事件の詳細を構築中...' },
  { threshold: 30, label: '真相を設計中...' },
  { threshold: 45, label: 'キャラクターを生成中...' },
  { threshold: 60, label: 'タイムラインを構築中...' },
  { threshold: 75, label: '証拠を配置中...' },
  { threshold: 85, label: 'GMガイドを作成中...' },
  { threshold: 95, label: '最終確認中...' },
]

export function LoadingState({ progress }: LoadingStateProps) {
  const currentStage = stages.reduce((acc, stage) => {
    if (progress >= stage.threshold) return stage
    return acc
  }, stages[0])

  return (
    <div className="bg-[#121212] border border-white/20 rounded-lg p-12 text-center">
      <h2 className="text-2xl font-bold text-white mb-8">シナリオを構築中</h2>

      <div className="w-20 h-20 mx-auto mb-8">
        <svg className="animate-spin w-full h-full" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

      <p className="text-gray-400 mb-8">{currentStage.label}</p>

      <div className="max-w-md mx-auto">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">{progress}%</p>
      </div>

      <p className="text-sm text-gray-600 mt-8">
        生成には30秒〜2分程度かかります。このページを離れないでください。
      </p>
    </div>
  )
}
