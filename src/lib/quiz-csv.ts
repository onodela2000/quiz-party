import Papa from "papaparse"
import type { QuizForm } from "@/features/host-create/QuizEditor"

const HEADER_ALIASES = {
  question: ["question", "問題", "問題文"],
  choiceA: ["choice_a", "choicea", "選択肢a", "選択肢1"],
  choiceB: ["choice_b", "choiceb", "選択肢b", "選択肢2"],
  choiceC: ["choice_c", "choicec", "選択肢c", "選択肢3"],
  choiceD: ["choice_d", "choiced", "選択肢d", "選択肢4"],
  correct: ["correct", "correct_answer", "正解", "正解番号"],
  explanation: ["explanation", "解説"],
} as const

export const QUIZ_CSV_TEMPLATE = [
  "question,choice_a,choice_b,choice_c,choice_d,correct,explanation",
  '花巻市の市の花は？,ハヤチネウスユキソウ,バラ,ヒマワリ,サクラ,A,"早池峰山に咲く高山植物です。"',
].join("\r\n")

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]/g, "")
}

function findValue(row: Record<string, string>, aliases: readonly string[]) {
  const normalizedAliases = aliases.map(normalizeHeader)
  const entry = Object.entries(row).find(([key]) => normalizedAliases.includes(normalizeHeader(key)))
  return entry?.[1]?.trim() ?? ""
}

function parseCorrectIndex(value: string, rowNumber: number) {
  const normalized = value.trim().toUpperCase()
  const labels = ["A", "B", "C", "D"]
  const labelIndex = labels.indexOf(normalized)
  if (labelIndex >= 0) return labelIndex

  const number = Number(normalized)
  if (Number.isInteger(number) && number >= 1 && number <= 4) return number - 1
  throw new Error(`${rowNumber}行目の正解は A〜D または 1〜4 で指定してください`)
}

export function parseQuizCsv(csv: string): QuizForm[] {
  const result = Papa.parse<Record<string, string>>(csv.replace(/^\uFEFF/, ""), {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim(),
  })

  if (result.errors.length > 0) {
    const first = result.errors[0]
    throw new Error(`CSVの${(first.row ?? 0) + 2}行目を読み取れません: ${first.message}`)
  }
  if (result.data.length === 0) throw new Error("CSVに問題がありません")

  return result.data.map((row, index) => {
    const rowNumber = index + 2
    const question = findValue(row, HEADER_ALIASES.question)
    const choices = [
      findValue(row, HEADER_ALIASES.choiceA),
      findValue(row, HEADER_ALIASES.choiceB),
      findValue(row, HEADER_ALIASES.choiceC),
      findValue(row, HEADER_ALIASES.choiceD),
    ]
    const correct = findValue(row, HEADER_ALIASES.correct)

    if (!question) throw new Error(`${rowNumber}行目の問題文が空です`)
    if (choices.some((choice) => !choice)) throw new Error(`${rowNumber}行目の選択肢を4つ入力してください`)
    if (!correct) throw new Error(`${rowNumber}行目の正解が空です`)

    return {
      question,
      choices,
      correct_index: parseCorrectIndex(correct, rowNumber),
      explanation: findValue(row, HEADER_ALIASES.explanation),
    }
  })
}

export async function readCsvFile(file: File) {
  const bytes = await file.arrayBuffer()
  const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(bytes)
  if (!utf8.includes("\uFFFD")) return utf8
  return new TextDecoder("shift_jis", { fatal: false }).decode(bytes)
}
