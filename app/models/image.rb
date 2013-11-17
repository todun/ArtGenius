class Image < ActiveRecord::Base
  attr_accessible :title, :user_id, :image
  has_attached_file :image

  belongs_to :user
end
