class AddImageIdToComment < ActiveRecord::Migration
  def change
    add_column :comments, :image_id, :integer
  end
end
