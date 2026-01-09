// シナリオ生成の型定義
// 全てのデータ構造を明確に定義し、型安全性を確保

export interface FormData {
  participants: number
  era: 'modern' | 'showa' | 'near-future' | 'fantasy'
  setting: 'closed-space' | 'mountain-villa' | 'military-facility' | 'underwater-facility' | 'city'
  worldview: 'realistic' | 'occult' | 'sci-fi' | 'mystery'
  tone: 'serious' | 'light' | 'horror' | 'comedy'
  complexity: 'simple' | 'standard' | 'complex'
  motive?: 'random' | 'money' | 'revenge' | 'love' | 'jealousy' | 'secret'
  victimType?: 'random' | 'wealthy' | 'celebrity' | 'businessman' | 'ordinary'
  weapon?: 'random' | 'knife' | 'poison' | 'blunt' | 'unusual'
  generateArtwork?: boolean
  detailedHandouts?: boolean
  gmSupport?: boolean
  customRequest?: string
}

export interface Character {
  id: string
  name: string
  role: string
  age?: string
  gender?: string
  occupation?: string
  personality: string
  background: string
  motivation: string
  secret: string
  relationships: string
  publicInfo: string  // プレイヤーに公開する情報
  privateInfo: string // GM専用情報
}

export interface TimelineEvent {
  time: string
  event: string
  participants?: string[]
  isPublic: boolean  // プレイヤーに公開するか
}

export interface Evidence {
  id: string
  name: string
  description: string
  location: string
  discoveredBy?: string
  revealsTruth: string  // この証拠が明かす真実
  isPublic: boolean
}

export interface ScenarioData {
  // 基本情報
  title: string
  subtitle?: string

  // 概要・設定
  overview: string
  setting: string
  atmosphere: string

  // 事件情報
  incident: {
    victim: string
    cause: string
    time: string
    location: string
    discovery: string
  }

  // 真相
  truth: {
    culprit: string
    motive: string
    method: string
    timeline: string
    cover: string  // 隠蔽工作
  }

  // キャラクター
  characters: Character[]

  // タイムライン
  timeline: TimelineEvent[]

  // 証拠・手がかり
  evidence: Evidence[]

  // GMガイド
  gmGuide: {
    progression: string    // 進行の流れ
    hints: string[]        // プレイヤーへのヒント例
    endingVariations: string  // エンディングバリエーション
    notes: string          // 注意事項
  }

  // メタデータ
  metadata: {
    formData: FormData
    generatedAt: string
    version: string
    playTime: string
  }
}

// 生成ステージの状態
export type GenerationStage =
  | 'idle'
  | 'outline'
  | 'concept'
  | 'incident'
  | 'details'
  | 'characters'
  | 'evidence'
  | 'gmGuide'
  | 'integration'
  | 'quality'
  | 'completed'
  | 'error'

export interface GenerationProgress {
  stage: GenerationStage
  stageIndex: number
  totalStages: number
  progress: number  // 0-100
  message: string
  partialData?: Partial<ScenarioData>
}

// API レスポンス型
export interface GenerationResult {
  success: boolean
  data?: ScenarioData
  error?: string
  progress?: GenerationProgress
}
