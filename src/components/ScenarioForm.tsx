'use client'

import { useState } from 'react'
import type { FormData } from '@/types/scenario'

interface ScenarioFormProps {
  onSubmit: (data: FormData) => void
}

export function ScenarioForm({ onSubmit }: ScenarioFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<FormData>>({
    participants: 5,
    era: 'modern',
    setting: 'closed-space',
    worldview: 'realistic',
    tone: 'serious',
    complexity: 'standard',
    motive: 'random',
    victimType: 'random',
    weapon: 'random',
    generateArtwork: true,
    detailedHandouts: true,
    gmSupport: true,
  })

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    onSubmit(formData as FormData)
  }

  const steps = [
    { id: 1, label: '基本設定' },
    { id: 2, label: '世界観' },
    { id: 3, label: '事件詳細' },
    { id: 4, label: 'オプション' },
  ]

  return (
    <div className="bg-[#121212] border border-white/20 rounded-lg p-8">
      {/* ステップインジケーター */}
      <div className="flex justify-between mb-8">
        {steps.map((s) => (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            className={`flex-1 py-3 text-sm font-medium transition border-b-2 ${
              step === s.id
                ? 'border-white text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="block">{s.id}</span>
            <span className="block text-xs mt-1">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Step 1: 基本設定 */}
      {step === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white mb-6">基本設定</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">参加人数</label>
              <select
                value={formData.participants}
                onChange={(e) => updateField('participants', Number(e.target.value))}
                className="w-full bg-[#1a1a1a] border border-white/20 rounded px-4 py-3 text-white"
              >
                {[4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n}人
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">時代背景</label>
              <select
                value={formData.era}
                onChange={(e) => updateField('era', e.target.value as FormData['era'])}
                className="w-full bg-[#1a1a1a] border border-white/20 rounded px-4 py-3 text-white"
              >
                <option value="modern">現代</option>
                <option value="showa">昭和・クラシック</option>
                <option value="near-future">近未来</option>
                <option value="fantasy">ファンタジー</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">舞台設定</label>
              <select
                value={formData.setting}
                onChange={(e) => updateField('setting', e.target.value as FormData['setting'])}
                className="w-full bg-[#1a1a1a] border border-white/20 rounded px-4 py-3 text-white"
              >
                <option value="closed-space">クローズドサークル</option>
                <option value="mountain-villa">孤絶した洋館</option>
                <option value="military-facility">軍事施設</option>
                <option value="underwater-facility">海底基地</option>
                <option value="city">都市部</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: 世界観 */}
      {step === 2 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white mb-6">世界観とトーン</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">世界観</label>
              <select
                value={formData.worldview}
                onChange={(e) => updateField('worldview', e.target.value as FormData['worldview'])}
                className="w-full bg-[#1a1a1a] border border-white/20 rounded px-4 py-3 text-white"
              >
                <option value="realistic">リアリスティック</option>
                <option value="occult">オカルト要素</option>
                <option value="sci-fi">SF設定</option>
                <option value="mystery">本格ミステリー</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">雰囲気</label>
              <select
                value={formData.tone}
                onChange={(e) => updateField('tone', e.target.value as FormData['tone'])}
                className="w-full bg-[#1a1a1a] border border-white/20 rounded px-4 py-3 text-white"
              >
                <option value="serious">シリアス・ノワール</option>
                <option value="light">カジュアル・ライト</option>
                <option value="horror">ゴシック・ホラー</option>
                <option value="comedy">コメディ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">難易度</label>
              <select
                value={formData.complexity}
                onChange={(e) =>
                  updateField('complexity', e.target.value as FormData['complexity'])
                }
                className="w-full bg-[#1a1a1a] border border-white/20 rounded px-4 py-3 text-white"
              >
                <option value="simple">初心者向け</option>
                <option value="standard">標準</option>
                <option value="complex">上級者向け</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: 事件詳細 */}
      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white mb-6">事件の詳細設定</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">犯行の動機</label>
              <select
                value={formData.motive}
                onChange={(e) => updateField('motive', e.target.value as FormData['motive'])}
                className="w-full bg-[#1a1a1a] border border-white/20 rounded px-4 py-3 text-white"
              >
                <option value="random">おまかせ</option>
                <option value="money">金銭・利欲</option>
                <option value="revenge">復讐・怨恨</option>
                <option value="love">情愛・愛憎</option>
                <option value="jealousy">嫉妬・羨望</option>
                <option value="secret">秘密の隠蔽</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">被害者の身元</label>
              <select
                value={formData.victimType}
                onChange={(e) =>
                  updateField('victimType', e.target.value as FormData['victimType'])
                }
                className="w-full bg-[#1a1a1a] border border-white/20 rounded px-4 py-3 text-white"
              >
                <option value="random">おまかせ</option>
                <option value="wealthy">資産家・貴族</option>
                <option value="celebrity">著名人・タレント</option>
                <option value="businessman">実業家・経営者</option>
                <option value="ordinary">一般市民</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">凶器</label>
              <select
                value={formData.weapon}
                onChange={(e) => updateField('weapon', e.target.value as FormData['weapon'])}
                className="w-full bg-[#1a1a1a] border border-white/20 rounded px-4 py-3 text-white"
              >
                <option value="random">おまかせ</option>
                <option value="knife">刃物</option>
                <option value="poison">毒物</option>
                <option value="blunt">鈍器</option>
                <option value="unusual">特殊な凶器</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: オプション */}
      {step === 4 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white mb-6">生成オプション</h3>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.detailedHandouts}
                onChange={(e) => updateField('detailedHandouts', e.target.checked)}
                className="w-5 h-5 rounded border-white/20"
              />
              <span className="text-white">詳細なキャラクターハンドアウト</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.gmSupport}
                onChange={(e) => updateField('gmSupport', e.target.checked)}
                className="w-5 h-5 rounded border-white/20"
              />
              <span className="text-white">GM用進行ガイド</span>
            </label>
          </div>

          <div className="mt-6">
            <label className="block text-sm text-gray-400 mb-2">追加リクエスト（任意）</label>
            <textarea
              value={formData.customRequest || ''}
              onChange={(e) => updateField('customRequest', e.target.value)}
              placeholder="特定の展開やキーワードなど、自由に記述してください..."
              className="w-full bg-[#1a1a1a] border border-white/20 rounded px-4 py-3 text-white h-24 resize-none"
            />
          </div>
        </div>
      )}

      {/* ナビゲーション */}
      <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
        <button
          onClick={() => setStep((prev) => Math.max(1, prev - 1))}
          disabled={step === 1}
          className="px-6 py-3 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          前へ
        </button>

        {step < 4 ? (
          <button
            onClick={() => setStep((prev) => prev + 1)}
            className="bg-white text-black px-8 py-3 rounded font-medium hover:bg-gray-200 transition"
          >
            次へ
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-white text-black px-8 py-3 rounded font-medium hover:bg-gray-200 transition"
          >
            シナリオを生成
          </button>
        )}
      </div>
    </div>
  )
}
