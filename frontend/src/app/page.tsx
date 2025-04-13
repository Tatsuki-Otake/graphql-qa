'use client'

import { gql, useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'

const GET_QUESTIONS = gql`
  query GetQuestions {
    questions {
      id
      content
      answer
      answered
      }
  }
`

const CREATE_QUESTION = gql`
  mutation CreateQuestion($content: String!) {
    createQuestion(input: { content: $content }) {
      question {
        id
        content
        answered
      }
      errors
    }
  }
`

const ANSWER_QUESTION = gql`
  mutation AnswerQuestion($id: ID!, $answer: String!) {
    answerQuestion(input: { id: $id, answer: $answer }) {
      question {
        id
        answer
        answered
      }
      errors
    }
  }
`

export default function Home() {
  const { loading, error, data, refetch } = useQuery(GET_QUESTIONS)
  const [content, setContent] = useState('')
  const [showUnansweredOnly, setShowUnansweredOnly] = useState(false)
  const [editingAnswers, setEditingAnswers] = useState<{ [id: string]: string }>({})

  const [createQuestion, { loading: creating, error: createError }] = useMutation(CREATE_QUESTION)
  const [answerQuestion] = useMutation(ANSWER_QUESTION)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    await createQuestion({ variables: { content } })
    setContent('')
    refetch()
  }

  const filteredQuestions = data?.questions.filter((q: any) =>
    showUnansweredOnly ? !q.answered : true
  )

  return (
    <main className="p-4 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">質問一覧</h1>

      {/*　質問投稿フォーム */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="質問を入力..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <button
          type="submit"
          disabled={creating}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 font-bold"
        >
          送信
        </button>
      </form>
      {createError && <p className="text-red-500">送信エラー: {createError.message}</p>}

      {/*未回答のみ表示切り替え */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showUnansweredOnly}
          onChange={(e) => setShowUnansweredOnly(e.target.checked)}
        />
        <label>未回答の質問のみ表示</label>
      </div>

      {/* 質問一覧 */}
      { loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">取得エラー: {error.message}</p>
      ) : (
        <ul className="space-y-4">
          {filteredQuestions.map((q: any) => (
            <li key={q.id} className="p-6 border rounded shadow-sm space-y-2">
              <p className="mb-2">
                <strong>質問:</strong> {q.content}
              </p>

              {q.answered ? (
                <div className="space-y-1">
                  <strong>回答:</strong>
                  {editingAnswers[q.id] !== undefined ? (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault()
                        const newAnswer = editingAnswers[q.id].trim()
                        if (!newAnswer) return
                        await answerQuestion({ variables: { id: q.id, answer: newAnswer } })
                        setEditingAnswers((prev) => {
                          const updated = { ...prev }
                          delete updated[q.id]
                          return updated
                        })
                        refetch()
                      }}
                      className="space-y-2"
                    >
                      <input
                        type="text"
                        value={editingAnswers[q.id]}
                        onChange={(e) =>
                          setEditingAnswers((prev) => ({
                            ...prev,
                            [q.id]: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border rounded"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        保存
                      </button>
                    </form>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p>{q.answer}</p>
                      <button
                        className="text-sm text-blue-600 underline"
                        onClick={() =>
                          setEditingAnswers((prev) => ({ ...prev, [q.id]: q.answer || '' }))
                        }
                      >
                        修正
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <form
                  className="space-y-2"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const form = e.target as HTMLFormElement
                    const input = form.elements.namedItem('answer') as HTMLInputElement
                    const answer = input.value.trim()
                    if (!answer) return

                    await answerQuestion({
                      variables: { id: q.id, answer},
                    })

                    refetch()
                    form.reset()
                  }}
                >
                  <label className="block">
                    <strong>回答：</strong>
                    <input
                      type="text"
                      name="answer"
                      className="ml-2 px-2 py-1 border rounded w-full mt-1"
                      placeholder="ここに回答を入力"
                    />
                  </label>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-green-600 text-white rounded font-bold"
                  >
                    回答する
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
