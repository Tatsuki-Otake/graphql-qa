module Mutations
  class DeleteAnswer < BaseMutation
    argument :id, ID, required: true

    field :question, Types::QuestionType, null: true
    field :errors, [String], null: false

    def resolve(id:)
      question = Question.find_by(id: id)
      return { question: nil, errors: ['質問が見つかりません'] } unless question

      question.answer = nil
      question.answered = false

      if question.save
        { question: question, errors: [] }
      else
        { question: nil, errors: question.errors.full_messages }
      end
    end
  end
end
