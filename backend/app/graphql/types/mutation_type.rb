# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_question, mutation: Mutations::CreateQuestion
    field :answer_question, mutation: Mutations::AnswerQuestion
    field :delete_answer, mutation: Mutations::DeleteAnswer

    field :test_field, String, null: false,
      description: "An example field added by the generator"
    def test_field
      "Hello World"
    end
  end
end
