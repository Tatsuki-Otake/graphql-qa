# frozen_string_literal: true

module Mutations
  class AnswerQuestion < BaseMutation
    argument :id, ID, required: true
    argument :answer, String, required: true

    field :question, Types::QuestionType, null: true
    field :errors, [String], null: false

    def resolve(id:, answer:)
      question = Question.find_by(id: id)

      return { question: nil, errors: ["質問が見つかりません"] } unless question

      if question.update(answer:answer, answered: true)
        {
          question: question,
          errors: [],
        }
      else
        {
          question: nil,
          errors: question.errors.full_messages,
        }
      end
    end
  end
end
