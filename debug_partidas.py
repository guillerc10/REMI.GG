#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lolstats_project.settings')
django.setup()

from stats.models import Partida, Participante, Invocador

# Buscar el invocador
invocador = Invocador.objects.get(riot_id="JokerVenom#LAN")
participaciones = Participante.objects.filter(invocador=invocador).select_related("partida").order_by("-partida__fecha")[:10]

print(f"\n📊 Últimas 10 partidas de {invocador.riot_id}:")
print("=" * 80)

for p in participaciones:
    print(f"Match: {p.partida.match_id}")
    print(f"  Modo: {p.partida.modo_juego}")
    print(f"  Queue ID: {p.partida.queue_id}")
    print(f"  Win: {p.win}")
    print(f"  LP Change: {p.lp_change}")
    print("-" * 80)
