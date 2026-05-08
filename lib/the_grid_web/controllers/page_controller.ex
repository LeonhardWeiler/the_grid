defmodule TheGridWeb.PageController do
  use TheGridWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
