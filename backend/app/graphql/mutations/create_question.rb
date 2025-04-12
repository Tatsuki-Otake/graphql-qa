module Mutations
  class CreateQuestion < BaseMutation
    argument :content, String, required: true

    field :question, Types::QuestionType, null: true
    field :errors, [String], null: false

    def resolve(content:)
      question = Question.new(content: content, answered: false)

      if question.save
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
