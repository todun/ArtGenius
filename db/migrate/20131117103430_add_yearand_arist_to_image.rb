class AddYearandAristToImage < ActiveRecord::Migration
  def change
    add_column :images, :artist, :string
    add_column :images, :year, :integer
  end
end
