class Add < ActiveRecord::Migration
  def up
	add_column :images, :description, :text
  end

  def down
  end
end
