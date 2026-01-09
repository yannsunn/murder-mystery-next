'use client'

import { useState } from 'react'
import { generateZipAction } from '@/actions/generate'
import type { ScenarioData } from '@/types/scenario'

interface ScenarioResultProps {
  scenario: ScenarioData
  onReset: () => void
}

export function ScenarioResult({ scenario, onReset }: ScenarioResultProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'timeline' | 'evidence' | 'gm'>('overview')

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const result = await generateZipAction(scenario)

      if (result.success && result.data && result.filename) {
        // Base64をBlobに変換してダウンロード
        const byteCharacters = atob(result.data)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: 'application/zip' })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = result.filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('ダウンロードに失敗しました: ' + (result.error || '不明なエラー'))
      }
    } catch (error) {
      console.error('Download error:', error)
      alert('ダウンロードに失敗しました')
    } finally {
      setIsDownloading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: '概要' },
    { id: 'characters', label: '登場人物' },
    { id: 'timeline', label: 'タイムライン' },
    { id: 'evidence', label: '証拠' },
    { id: 'gm', label: 'GMガイド' },
  ] as const

  return (
    <div className="bg-[#121212] border border-white/20 rounded-lg overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-white/5 p-8 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{scenario.title}</h2>
            {scenario.subtitle && <p className="text-gray-400">〜{scenario.subtitle}〜</p>}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-white text-black px-6 py-3 rounded font-medium hover:bg-gray-200 transition disabled:opacity-50"
            >
              {isDownloading ? 'ダウンロード中...' : 'ZIPダウンロード'}
            </button>
            <button
              onClick={onReset}
              className="border border-white/20 text-white px-6 py-3 rounded font-medium hover:bg-white/10 transition"
            >
              新しいシナリオ
            </button>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded">
            {scenario.metadata.formData.participants}人
          </span>
          <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded">
            {scenario.metadata.playTime}
          </span>
        </div>
      </div>

      {/* タブ */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-sm font-medium transition ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* コンテンツ */}
      <div className="p-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Section title="概要">
              <p className="text-gray-300 leading-relaxed">{scenario.overview}</p>
            </Section>
            <Section title="舞台設定">
              <p className="text-gray-300 leading-relaxed">{scenario.setting}</p>
            </Section>
            <Section title="雰囲気">
              <p className="text-gray-300 leading-relaxed">{scenario.atmosphere}</p>
            </Section>
            <Section title="事件">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">被害者:</span>
                  <span className="text-white ml-2">{scenario.incident.victim}</span>
                </div>
                <div>
                  <span className="text-gray-500">死因:</span>
                  <span className="text-white ml-2">{scenario.incident.cause}</span>
                </div>
                <div>
                  <span className="text-gray-500">時刻:</span>
                  <span className="text-white ml-2">{scenario.incident.time}</span>
                </div>
                <div>
                  <span className="text-gray-500">場所:</span>
                  <span className="text-white ml-2">{scenario.incident.location}</span>
                </div>
              </div>
            </Section>
          </div>
        )}

        {activeTab === 'characters' && (
          <div className="grid gap-6">
            {scenario.characters.map((char, index) => (
              <div key={char.id || index} className="bg-white/5 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{char.name}</h3>
                    <p className="text-gray-400">{char.role}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{char.age}</div>
                    <div>{char.occupation}</div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{char.personality}</p>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="text-gray-500">経歴:</span>
                    <span className="text-gray-300 ml-2">{char.background}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">関係性:</span>
                    <span className="text-gray-300 ml-2">{char.relationships}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-4">
            {scenario.timeline.map((event, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-20 text-right">
                  <span className="text-white font-mono">{event.time}</span>
                </div>
                <div className="flex-1 bg-white/5 rounded p-4">
                  <p className="text-gray-300">{event.event}</p>
                  {event.participants && event.participants.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      関係者: {event.participants.join('、')}
                    </p>
                  )}
                  {!event.isPublic && (
                    <span className="inline-block mt-2 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                      GM専用
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="grid gap-4">
            {scenario.evidence.map((e, index) => (
              <div key={e.id || index} className="bg-white/5 rounded-lg p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{e.name}</h3>
                  {!e.isPublic && (
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                      GM専用
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-3">場所: {e.location}</p>
                <p className="text-gray-300">{e.description}</p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">示唆すること:</span> {e.revealsTruth}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'gm' && (
          <div className="space-y-6">
            <Section title="犯人と動機" className="bg-red-500/10 border border-red-500/30">
              <p className="text-white font-bold mb-2">{scenario.truth.culprit}</p>
              <p className="text-gray-300">{scenario.truth.motive}</p>
            </Section>
            <Section title="犯行方法">
              <p className="text-gray-300">{scenario.truth.method}</p>
            </Section>
            <Section title="隠蔽工作">
              <p className="text-gray-300">{scenario.truth.cover}</p>
            </Section>
            <Section title="ゲーム進行">
              <p className="text-gray-300">{scenario.gmGuide.progression}</p>
            </Section>
            <Section title="ヒント例">
              <ul className="list-disc list-inside space-y-2">
                {scenario.gmGuide.hints.map((hint, i) => (
                  <li key={i} className="text-gray-300">
                    {hint}
                  </li>
                ))}
              </ul>
            </Section>
            <Section title="エンディングパターン">
              <p className="text-gray-300">{scenario.gmGuide.endingVariations}</p>
            </Section>
            <Section title="注意事項">
              <p className="text-gray-300">{scenario.gmGuide.notes}</p>
            </Section>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`bg-white/5 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      {children}
    </div>
  )
}
