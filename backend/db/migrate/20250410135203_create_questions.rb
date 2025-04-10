class CreateQuestions < ActiveRecord::Migration[8.0]
  def change
    create_table :questions do |t|
      t.text :content
      t.text :answer
      t.boolean :answered, default: false

      t.timestamps
    end
  end
end
