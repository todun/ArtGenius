class UsersController < Devise::SessionsController
  def create
    redirect_to "home#index"
  end
end
