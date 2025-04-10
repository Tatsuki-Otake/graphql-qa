'use client'

import { gql, useQuery } from '@apollo/client'

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

export default function Home() {
  const { loading, error, data } = useQuery(GET_QUESTIONS)

  if (loading) return <p className="p-4">Loading...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error.message}</p>

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">質問一覧</h1>
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
    </main>
  )
}
