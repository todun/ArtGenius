class Comment < ActiveRecord::Base
  attr_accessible :text, :user_id, :x1, :x2, :y1, :y2, :image_id
  belongs_to :image
  belongs_to :user
end
