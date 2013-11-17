class Image < ActiveRecord::Base
  attr_accessible :title, :user_id, :image
  has_attached_file :image

  has_many :comments
  belongs_to :user
end
