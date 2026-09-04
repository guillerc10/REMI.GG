from django.contrib import admin
from .models import Invocador, Liga, Partida, Campeon, Participante

admin.site.register(Invocador)
admin.site.register(Liga)
admin.site.register(Partida)
admin.site.register(Campeon)
admin.site.register(Participante)