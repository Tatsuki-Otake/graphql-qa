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
  const [createQuestion, {loading: creating, error: createError }] = useMutation(CREATE_QUESTION)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    await createQuestion({ variables: { content } })
    setContent('')
    refetch()
  }

  return (
    <main className="p-4 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">質問一覧</h1>

      {/*　投稿フォーム */}
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
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          送信
        </button>
      </form>
      {createError && <p className="text-red-500">送信エラー: {createError.message}</p>}

      {/* 一覧表示 */}
      { loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">取得エラー: {error.message}</p>
      ) : (
        <ul className="space-y-4">
          {data.questions.map((q: any) => (
            <li key={q.id} className="p-4 border rounded shadow-sm">
              <p className="mb-2">
                <strong>質問:</strong> {q.content}
              </p>
              <p>
                <strong>回答:</strong>{' '}
                {q.answered ? q.answer : <span className="text-gray-500">未回答</span>}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    )
  }
