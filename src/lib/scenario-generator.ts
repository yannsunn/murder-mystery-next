import { generateWithAI } from './gemini'
import type { FormData, ScenarioData, Character, TimelineEvent, Evidence } from '@/types/scenario'

// 日本語ラベルのマッピング
const eraLabels: Record<string, string> = {
  modern: '現代',
  showa: '昭和・クラシック',
  'near-future': '近未来',
  fantasy: 'ファンタジー',
}

const settingLabels: Record<string, string> = {
  'closed-space': 'クローズドサークル',
  'mountain-villa': '孤絶した洋館',
  'military-facility': '軍事施設',
  'underwater-facility': '海底基地',
  city: '都市部',
}

const toneLabels: Record<string, string> = {
  serious: 'シリアス・ノワール',
  light: 'カジュアル・ライト',
  horror: 'ゴシック・ホラー',
  comedy: 'コメディ',
}

const complexityLabels: Record<string, string> = {
  simple: '初心者向け',
  standard: '標準',
  complex: '上級者向け',
}

function getPlayTime(complexity: string): string {
  const times: Record<string, string> = {
    simple: '30-45分',
    standard: '60-90分',
    complex: '90-120分',
  }
  return times[complexity] || '60分'
}

export async function generateScenario(formData: FormData): Promise<ScenarioData> {
  // Step 1: 基本構造・アウトライン生成
  const outline = await generateOutline(formData)

  // Step 2: 事件詳細生成
  const incident = await generateIncident(formData, outline)

  // Step 3: 真相生成
  const truth = await generateTruth(formData, outline, incident)

  // Step 4: キャラクター生成
  const characters = await generateCharacters(formData, outline, truth)

  // Step 5: タイムライン生成
  const timeline = await generateTimeline(formData, truth, characters)

  // Step 6: 証拠生成
  const evidence = await generateEvidence(formData, truth, characters)

  // Step 7: GMガイド生成
  const gmGuide = await generateGMGuide(formData, truth, characters, timeline, evidence)

  return {
    title: outline.title,
    subtitle: outline.subtitle,
    overview: outline.overview,
    setting: outline.setting,
    atmosphere: outline.atmosphere,
    incident,
    truth,
    characters,
    timeline,
    evidence,
    gmGuide,
    metadata: {
      formData,
      generatedAt: new Date().toISOString(),
      version: '2.0.0',
      playTime: getPlayTime(formData.complexity),
    },
  }
}

async function generateOutline(formData: FormData) {
  const systemPrompt = `あなたは商業レベルのマーダーミステリー作家です。魅力的で謎に満ちたシナリオの骨格を作成してください。`

  const userPrompt = `
以下の設定でマーダーミステリーシナリオのアウトラインを作成してください。

【設定】
- 参加人数: ${formData.participants}人
- 時代: ${eraLabels[formData.era]}
- 舞台: ${settingLabels[formData.setting]}
- 雰囲気: ${toneLabels[formData.tone]}
- 難易度: ${complexityLabels[formData.complexity]}
${formData.customRequest ? `- 追加リクエスト: ${formData.customRequest}` : ''}

以下のJSON形式で出力してください:
{
  "title": "シナリオタイトル",
  "subtitle": "サブタイトル（任意）",
  "overview": "物語の概要（200文字程度）",
  "setting": "舞台の詳細説明（150文字程度）",
  "atmosphere": "雰囲気・テーマの説明（100文字程度）"
}
`

  const response = await generateWithAI(systemPrompt, userPrompt, { maxTokens: 1500 })
  return parseJSON(response, {
    title: 'マーダーミステリー',
    subtitle: '',
    overview: '',
    setting: '',
    atmosphere: '',
  })
}

async function generateIncident(formData: FormData, outline: { title: string; overview: string }) {
  const systemPrompt = `あなたはミステリー作家です。説得力のある事件を設計してください。`

  const userPrompt = `
シナリオ「${outline.title}」の事件詳細を作成してください。

概要: ${outline.overview}

以下のJSON形式で出力してください:
{
  "victim": "被害者の名前と簡単な説明",
  "cause": "死因・事件の種類",
  "time": "事件発生時刻",
  "location": "事件発生場所",
  "discovery": "発見の状況"
}
`

  const response = await generateWithAI(systemPrompt, userPrompt, { maxTokens: 1000 })
  return parseJSON(response, {
    victim: '',
    cause: '',
    time: '',
    location: '',
    discovery: '',
  })
}

async function generateTruth(
  formData: FormData,
  outline: { title: string; overview: string },
  incident: { victim: string; cause: string }
) {
  const systemPrompt = `あなたはミステリー作家です。論理的で驚きのある真相を設計してください。`

  const userPrompt = `
シナリオ「${outline.title}」の真相を作成してください。

概要: ${outline.overview}
被害者: ${incident.victim}
死因: ${incident.cause}

以下のJSON形式で出力してください:
{
  "culprit": "犯人の名前と動機の概要",
  "motive": "詳細な動機（200文字程度）",
  "method": "犯行方法の詳細（200文字程度）",
  "timeline": "犯行のタイムライン",
  "cover": "隠蔽工作・偽装の詳細"
}
`

  const response = await generateWithAI(systemPrompt, userPrompt, { maxTokens: 1500 })
  return parseJSON(response, {
    culprit: '',
    motive: '',
    method: '',
    timeline: '',
    cover: '',
  })
}

async function generateCharacters(
  formData: FormData,
  outline: { title: string; overview: string },
  truth: { culprit: string }
): Promise<Character[]> {
  const systemPrompt = `あなたはキャラクターデザイナーです。魅力的で多面的なキャラクターを作成してください。各キャラクターには明確な動機、秘密、関係性を設定してください。`

  const userPrompt = `
シナリオ「${outline.title}」のキャラクターを${formData.participants}人作成してください。

概要: ${outline.overview}
犯人情報: ${truth.culprit}

各キャラクターに以下を必ず含めてください:
1. 犯人となるキャラクター1人
2. 容疑がかかりやすいキャラクター1-2人
3. 重要な情報を持つキャラクター
4. 全員に秘密と動機を設定

以下のJSON形式で出力してください:
{
  "characters": [
    {
      "id": "char_1",
      "name": "キャラクター名",
      "role": "役職・立場",
      "age": "年齢",
      "gender": "性別",
      "occupation": "職業",
      "personality": "性格（50文字程度）",
      "background": "経歴・背景（100文字程度）",
      "motivation": "事件に関わる動機（100文字程度）",
      "secret": "隠している秘密（100文字程度）",
      "relationships": "他キャラとの関係（100文字程度）",
      "publicInfo": "他のプレイヤーに公開される情報",
      "privateInfo": "GM専用の追加情報"
    }
  ]
}
`

  const response = await generateWithAI(systemPrompt, userPrompt, { maxTokens: 4000, temperature: 0.8 })
  const parsed = parseJSON(response, { characters: [] })
  return parsed.characters || []
}

async function generateTimeline(
  formData: FormData,
  truth: { timeline: string },
  characters: Character[]
): Promise<TimelineEvent[]> {
  const characterNames = characters.map((c) => c.name).join('、')

  const systemPrompt = `あなたはミステリー作家です。事件のタイムラインを論理的に作成してください。`

  const userPrompt = `
事件のタイムラインを作成してください。

犯行タイムライン: ${truth.timeline}
登場人物: ${characterNames}

以下のJSON形式で出力してください:
{
  "timeline": [
    {
      "time": "19:00",
      "event": "イベントの説明",
      "participants": ["関係するキャラクター名"],
      "isPublic": true
    }
  ]
}

※ isPublic: true は全員に公開、false はGM専用
`

  const response = await generateWithAI(systemPrompt, userPrompt, { maxTokens: 2000 })
  const parsed = parseJSON(response, { timeline: [] })
  return parsed.timeline || []
}

async function generateEvidence(
  formData: FormData,
  truth: { method: string; cover: string },
  characters: Character[]
): Promise<Evidence[]> {
  const systemPrompt = `あなたはミステリー作家です。推理に必要な証拠と手がかりを設計してください。`

  const userPrompt = `
事件の証拠・手がかりを作成してください。

犯行方法: ${truth.method}
隠蔽工作: ${truth.cover}

以下のJSON形式で出力してください:
{
  "evidence": [
    {
      "id": "evidence_1",
      "name": "証拠名",
      "description": "詳細な説明",
      "location": "発見場所",
      "discoveredBy": "発見者（任意）",
      "revealsTruth": "この証拠が示唆すること",
      "isPublic": true
    }
  ]
}

※ 5-8個の証拠を作成してください
`

  const response = await generateWithAI(systemPrompt, userPrompt, { maxTokens: 2500 })
  const parsed = parseJSON(response, { evidence: [] })
  return parsed.evidence || []
}

async function generateGMGuide(
  formData: FormData,
  truth: { culprit: string; motive: string },
  characters: Character[],
  timeline: TimelineEvent[],
  evidence: Evidence[]
) {
  const systemPrompt = `あなたはマーダーミステリーのGMガイドを作成する専門家です。GMが円滑に進行できるガイドを作成してください。`

  const userPrompt = `
GMガイドを作成してください。

犯人: ${truth.culprit}
動機: ${truth.motive}
キャラクター数: ${characters.length}人
証拠数: ${evidence.length}個

以下のJSON形式で出力してください:
{
  "progression": "ゲーム進行の流れ（300文字程度）",
  "hints": ["プレイヤーへのヒント例1", "ヒント例2", "ヒント例3"],
  "endingVariations": "考えられるエンディングパターン（200文字程度）",
  "notes": "GMへの注意事項（150文字程度）"
}
`

  const response = await generateWithAI(systemPrompt, userPrompt, { maxTokens: 2000 })
  return parseJSON(response, {
    progression: '',
    hints: [],
    endingVariations: '',
    notes: '',
  })
}

function parseJSON<T>(text: string, defaultValue: T): T {
  try {
    // JSONブロックを抽出
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    const jsonStr = jsonMatch ? jsonMatch[1] : text

    // 余分な文字を除去
    const cleaned = jsonStr
      .replace(/^[^{[]*/, '')
      .replace(/[^}\]]*$/, '')
      .trim()

    return JSON.parse(cleaned)
  } catch {
    console.error('JSON parse error:', text.substring(0, 500))
    return defaultValue
  }
}
