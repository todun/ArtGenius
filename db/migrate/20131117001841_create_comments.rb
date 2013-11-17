class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.integer :x1
      t.integer :x2
      t.integer :y1
      t.integer :y2
      t.integer :user_id
      t.text :text

      t.timestamps
    end
  end
end
