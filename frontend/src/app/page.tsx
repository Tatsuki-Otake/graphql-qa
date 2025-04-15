'use client'

import { gql, useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'

type Question = {
  id: string
  content: string
  answer: string | null
  answered: boolean
  createdAt: string
}

type GetQuestionsData = {
  questions: Question[]
}

const GET_QUESTIONS = gql`
  query GetQuestions {
    questions {
      id
      content
      answer
      answered
      createdAt
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

const DELETE_ANSWER = gql`
  mutation DeleteAnswer($id: ID!) {
    deleteAnswer(input: { id: $id }) {
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
  const { loading, error, data, refetch } = useQuery<GetQuestionsData>(GET_QUESTIONS)
  const [content, setContent] = useState('')
  const [showUnansweredOnly, setShowUnansweredOnly] = useState(false)
  const [editingAnswers, setEditingAnswers] = useState<{ [id: string]: string }>({})
  const [createQuestion, { loading: creating, error: createError }] = useMutation(CREATE_QUESTION)
  const [answerQuestion] = useMutation(ANSWER_QUESTION)
  const [deleteAnswer] = useMutation(DELETE_ANSWER)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed || trimmed.length > 200) return
    await createQuestion({ variables: { content: trimmed } })
    setContent('')
    refetch()
  }

  const filteredQuestions: Question[] | undefined = data?.questions.filter((q: Question) =>
    showUnansweredOnly ? !q.answered : true
  )

  return (
    <main className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">質問一覧</h1>

      {/*　質問投稿フォーム */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={content}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
          placeholder="質問を入力(200文字以内)"
          maxLength={200}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={creating || !content.trim() || content.length > 200}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition disabled:opacity-50 font-bold"
        >
          送信
        </button>
      </form>
      {createError && <p className="text-red-500">送信エラー: {createError.message}</p>}

      {/*未回答のみ表示切り替えフィルター */}
      <div className="flex items-center gap-2">
        <input
          id="filter-unanswered"
          type="checkbox"
          checked={showUnansweredOnly}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowUnansweredOnly(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="filter-unanswered" className="text-sm text-gray-700">
          未回答の質問のみ表示
        </label>
      </div>

      {/* 質問一覧 */}
      { loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">取得エラー: {error.message}</p>
      ) : (
        <ul className="space-y-4">
          {filteredQuestions?.map((q: Question) => (
            <li key={q.id} className="p-6 border rounded shadow-sm space-y-2">
              <p className="mb-2 font-medium">
                <strong>質問:</strong> {q.content}
              </p>
              <p className="text-xs text-amber-500">
                投稿日: {new Date(q.createdAt).toLocaleString()}
              </p>

              {q.answered ? (
                <div className="space-y-1">
                  <strong>回答:</strong>
                  {editingAnswers[q.id] !== undefined ? (
                    <form
                      onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault()
                        const newAnswer = editingAnswers[q.id].trim()
                        if (!newAnswer || newAnswer.length > 300) return
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
                        maxLength={300}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditingAnswers((prev) => ({
                            ...prev,
                            [q.id]: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-green-300"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        保存
                      </button>
                      <button
                        className="text-sm text-red-500 underline ml-4"
                        onClick={async () => {
                          await deleteAnswer({ variables: { id: q.id } })
                          refetch()
                        }}
                      >
                        削除
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
                  onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault()
                    const form = e.currentTarget
                    const input = form.elements.namedItem('answer') as HTMLInputElement
                    const answer = input.value.trim()
                    if (!answer || answer.length > 300) return

                    await answerQuestion({
                      variables: { id: q.id, answer},
                    })

                    refetch()
                    form.reset()
                  }}
                >
                  <label className="block text-sm font-medium">
                    <strong>回答：</strong>
                    <input
                      type="text"
                      name="answer"
                      placeholder="ここに回答を入力"
                      maxLength={300}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-green-300"

                    />
                  </label>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-green-600 text-white rounded hover: bg-green-700 font-bold"
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
