import JSZip from 'jszip'
import type { ScenarioData, Character } from '@/types/scenario'

export async function generateZip(scenario: ScenarioData): Promise<Buffer> {
  const zip = new JSZip()
  const timestamp = new Date().toISOString().split('T')[0]
  const safeTitle = scenario.title.replace(/[<>:"/\\|?*]/g, '_')

  const mainFolder = zip.folder(`${safeTitle}_${timestamp}`)
  if (!mainFolder) throw new Error('Failed to create zip folder')

  // 1. シナリオ概要
  mainFolder.file('00_シナリオ概要.txt', createOverview(scenario))

  // 2. GM用資料フォルダ
  const gmFolder = mainFolder.folder('GM用資料')
  if (gmFolder) {
    gmFolder.file('01_真相解説.txt', createTruthDocument(scenario))
    gmFolder.file('02_タイムライン.txt', createTimelineDocument(scenario))
    gmFolder.file('03_証拠一覧.txt', createEvidenceDocument(scenario))
    gmFolder.file('04_進行ガイド.txt', createGMGuideDocument(scenario))
    gmFolder.file('05_キャラクター詳細（GM用）.txt', createGMCharacterDocument(scenario))
  }

  // 3. プレイヤー配布資料
  const playerFolder = mainFolder.folder('プレイヤー配布資料')
  if (playerFolder) {
    playerFolder.file('導入シナリオ.txt', createIntroduction(scenario))

    // 個別ハンドアウト
    const handoutFolder = playerFolder.folder('キャラクターハンドアウト')
    if (handoutFolder) {
      scenario.characters.forEach((char, index) => {
        const filename = `${String(index + 1).padStart(2, '0')}_${char.name}.txt`
        handoutFolder.file(filename, createCharacterHandout(char, scenario))
      })
    }

    // 公開証拠
    playerFolder.file('公開情報.txt', createPublicInfo(scenario))
  }

  // 4. メタデータ
  mainFolder.file('scenario_metadata.json', JSON.stringify(scenario.metadata, null, 2))

  // ZIP生成
  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  })

  return buffer
}

function createOverview(scenario: ScenarioData): string {
  const { metadata } = scenario
  const formData = metadata.formData

  return `=====================================
マーダーミステリー シナリオ概要
=====================================

【タイトル】
${scenario.title}
${scenario.subtitle ? `〜${scenario.subtitle}〜` : ''}

【基本情報】
参加人数: ${formData.participants}人
推奨プレイ時間: ${metadata.playTime}
難易度: ${formData.complexity === 'simple' ? '初心者向け' : formData.complexity === 'complex' ? '上級者向け' : '標準'}

【概要】
${scenario.overview}

【舞台設定】
${scenario.setting}

【雰囲気】
${scenario.atmosphere}

-------------------------------------
生成日時: ${metadata.generatedAt}
バージョン: ${metadata.version}
=====================================
`
}

function createTruthDocument(scenario: ScenarioData): string {
  const { truth, incident } = scenario

  return `=====================================
【GM専用】真相解説書
=====================================
※このドキュメントはGM専用です。プレイヤーには絶対に見せないでください。

【事件の概要】
被害者: ${incident.victim}
死因: ${incident.cause}
発生時刻: ${incident.time}
発生場所: ${incident.location}
発見状況: ${incident.discovery}

-------------------------------------
【犯人】
${truth.culprit}

【動機】
${truth.motive}

【犯行方法】
${truth.method}

【犯行のタイムライン】
${truth.timeline}

【隠蔽工作】
${truth.cover}

=====================================
`
}

function createTimelineDocument(scenario: ScenarioData): string {
  const publicEvents = scenario.timeline.filter((e) => e.isPublic)
  const privateEvents = scenario.timeline.filter((e) => !e.isPublic)

  let content = `=====================================
【GM専用】事件タイムライン
=====================================

【公開タイムライン】
プレイヤーに公開可能な情報
-------------------------------------
`

  publicEvents.forEach((event) => {
    content += `${event.time}: ${event.event}\n`
    if (event.participants?.length) {
      content += `  （関係者: ${event.participants.join('、')}）\n`
    }
  })

  content += `
-------------------------------------
【非公開タイムライン】
GM専用情報
-------------------------------------
`

  privateEvents.forEach((event) => {
    content += `${event.time}: ${event.event}\n`
    if (event.participants?.length) {
      content += `  （関係者: ${event.participants.join('、')}）\n`
    }
  })

  content += `
=====================================
`

  return content
}

function createEvidenceDocument(scenario: ScenarioData): string {
  let content = `=====================================
【GM専用】証拠・手がかり一覧
=====================================

`

  scenario.evidence.forEach((e, index) => {
    content += `【証拠${index + 1}】${e.name}
場所: ${e.location}
${e.discoveredBy ? `発見者: ${e.discoveredBy}` : ''}
公開: ${e.isPublic ? 'プレイヤーに公開可' : 'GM専用'}

説明:
${e.description}

この証拠が示すこと:
${e.revealsTruth}

-------------------------------------
`
  })

  return content
}

function createGMGuideDocument(scenario: ScenarioData): string {
  const { gmGuide } = scenario

  return `=====================================
【GM専用】進行ガイド
=====================================

【ゲーム進行の流れ】
${gmGuide.progression}

-------------------------------------
【プレイヤーへのヒント例】
${gmGuide.hints.map((h, i) => `${i + 1}. ${h}`).join('\n')}

-------------------------------------
【エンディングパターン】
${gmGuide.endingVariations}

-------------------------------------
【GMへの注意事項】
${gmGuide.notes}

=====================================
`
}

function createGMCharacterDocument(scenario: ScenarioData): string {
  let content = `=====================================
【GM専用】キャラクター詳細
=====================================

`

  scenario.characters.forEach((char, index) => {
    content += `【キャラクター${index + 1}】${char.name}
役職: ${char.role}
年齢: ${char.age || '不明'}
性別: ${char.gender || '不明'}
職業: ${char.occupation || '不明'}

性格:
${char.personality}

経歴:
${char.background}

動機:
${char.motivation}

秘密:
${char.secret}

関係性:
${char.relationships}

GM専用情報:
${char.privateInfo}

-------------------------------------
`
  })

  return content
}

function createIntroduction(scenario: ScenarioData): string {
  return `=====================================
導入シナリオ
=====================================

【${scenario.title}】
${scenario.subtitle ? `〜${scenario.subtitle}〜` : ''}

${scenario.overview}

【舞台】
${scenario.setting}

-------------------------------------
【事件発生】

${scenario.incident.discovery}

被害者は ${scenario.incident.victim} です。
${scenario.incident.cause} により命を落としました。

事件は ${scenario.incident.time} 頃、${scenario.incident.location} で発生したと思われます。

-------------------------------------
プレイヤーの皆様へ

あなたは ${scenario.metadata.formData.participants} 人の登場人物の一人として、
この事件の真相を解明してください。

【ルール】
1. 自分のハンドアウトの内容は秘密にしてください
2. 嘘をついても構いませんが、ゲームを楽しむことを忘れずに
3. GMの指示に従ってください
4. 推理を楽しみましょう！

=====================================
`
}

function createCharacterHandout(char: Character, scenario: ScenarioData): string {
  return `=====================================
【あなた専用ハンドアウト】
=====================================
※このハンドアウトはあなた専用です。
　他のプレイヤーには見せないでください。

【あなたの役割】
${char.name}（${char.role}）

【基本情報】
年齢: ${char.age || '不明'}
性別: ${char.gender || '不明'}
職業: ${char.occupation || '不明'}

【性格】
${char.personality}

【経歴・背景】
${char.background}

-------------------------------------
【あなたの動機】
${char.motivation}

-------------------------------------
【あなたの秘密】
※これはあなただけが知っている情報です

${char.secret}

-------------------------------------
【他の人物との関係】
${char.relationships}

-------------------------------------
【公開情報】
以下の情報は他のプレイヤーに聞かれたら答えても構いません

${char.publicInfo}

=====================================
【ロールプレイのヒント】
あなたの立場・状況を考えて行動してください。
嘘をつくことも、真実を語ることもできます。
ただし、ゲームを楽しむことを忘れずに！
=====================================
`
}

function createPublicInfo(scenario: ScenarioData): string {
  const publicEvidence = scenario.evidence.filter((e) => e.isPublic)
  const publicTimeline = scenario.timeline.filter((e) => e.isPublic)

  let content = `=====================================
公開情報
=====================================
この情報は全プレイヤーに公開されています。

【事件の概要】
${scenario.incident.discovery}

【被害者】
${scenario.incident.victim}

【死因】
${scenario.incident.cause}

-------------------------------------
【発見された証拠】
`

  publicEvidence.forEach((e, index) => {
    content += `
${index + 1}. ${e.name}
   場所: ${e.location}
   ${e.description}
`
  })

  content += `
-------------------------------------
【判明しているタイムライン】
`

  publicTimeline.forEach((event) => {
    content += `${event.time}: ${event.event}\n`
  })

  content += `
=====================================
`

  return content
}
