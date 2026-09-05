from django.urls import path
from . import views

urlpatterns = [
    path("invocador/<str:game_name>/<str:tag_line>/", views.perfil_invocador),
    path("invocador/<str:game_name>/<str:tag_line>/ligas/", views.ligas_invocador),
    path("invocador/<str:game_name>/<str:tag_line>/winrate/", views.winrate_invocador),
    path("invocador/<str:game_name>/<str:tag_line>/kda/", views.kda_invocador),
    path("invocador/<str:game_name>/<str:tag_line>/campeones/", views.campeones_invocador),
    path("invocador/<str:game_name>/<str:tag_line>/companeros/", views.companeros_invocador),
    path("comparar/", views.comparar_invocadores),
]