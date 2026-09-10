from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests 

from .models import Invocador, Liga
from .services import sincronizar_historial
from .analytics import (
    calcular_winrate,
    calcular_kda_promedio,
    stats_por_campeon,
    companeros_frecuentes,
)

from .analytics import (
    calcular_winrate,
    calcular_kda_promedio,
    stats_por_campeon,
    companeros_frecuentes,
    historial_partidas,
    detalle_partida,
)

def _obtener_invocador_o_sincronizar(game_name, tag_line):
    riot_id = f"{game_name}#{tag_line}"
    try:
        return Invocador.objects.get(riot_id=riot_id), None
    except Invocador.DoesNotExist:
        try:
            invocador = sincronizar_historial(game_name, tag_line, count=10)
            return invocador, None
        except requests.exceptions.HTTPError as e:
            print(f"[ERROR Riot API] Status: {e.response.status_code} - {e.response.text}")
            if e.response.status_code == 404:
                return None, Response(
                    {"error": f"No se encontró el invocador {riot_id}"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            return None, Response(
                {"error": f"Error al consultar Riot API (status {e.response.status_code})"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

@api_view(["GET"])
def perfil_invocador(request, game_name, tag_line):
    invocador, error = _obtener_invocador_o_sincronizar(game_name, tag_line)
    if error:
        return error
    return Response({
        "riot_id": invocador.riot_id,
        "summoner_level": invocador.summoner_level,
        "profile_icon_id": invocador.profile_icon_id,
    })


@api_view(["GET"])
def ligas_invocador(request, game_name, tag_line):
    invocador, error = _obtener_invocador_o_sincronizar(game_name, tag_line)
    if error:
        return error
    ligas = Liga.objects.filter(invocador=invocador)
    data = [{
        "queue_type": l.queue_type,
        "tier": l.tier,
        "rank": l.rank,
        "league_points": l.league_points,
        "wins": l.wins,
        "losses": l.losses,
    } for l in ligas]
    return Response(data)


@api_view(["GET"])
def winrate_invocador(request, game_name, tag_line):
    invocador, error = _obtener_invocador_o_sincronizar(game_name, tag_line)
    if error:
        return error
    return Response(calcular_winrate(invocador))


@api_view(["GET"])
def kda_invocador(request, game_name, tag_line):
    invocador, error = _obtener_invocador_o_sincronizar(game_name, tag_line)
    if error:
        return error
    return Response(calcular_kda_promedio(invocador))


@api_view(["GET"])
def campeones_invocador(request, game_name, tag_line):
    invocador, error = _obtener_invocador_o_sincronizar(game_name, tag_line)
    if error:
        return error
    return Response(stats_por_campeon(invocador))


@api_view(["GET"])
def companeros_invocador(request, game_name, tag_line):
    invocador, error = _obtener_invocador_o_sincronizar(game_name, tag_line)
    if error:
        return error
    return Response(companeros_frecuentes(invocador))   
@api_view(["GET"])
def historial_invocador(request, game_name, tag_line):
    invocador, error = _obtener_invocador_o_sincronizar(game_name, tag_line)
    if error:
        return error
    return Response(historial_partidas(invocador))

@api_view(["GET"])
def maestrias_invocador(request, game_name, tag_line):
    """
    Obtiene las maestrías de campeones del invocador.
    """
    print(f"\n{'='*60}")
    print(f"🔍 MAESTRIAS_INVOCADOR: {game_name}#{tag_line}")
    print(f"{'='*60}")

    try:
        from .services import obtener_summoner, obtener_maestrias

        # Obtener PUUID y luego summoner_id desde Riot API
        print(f"\n1️⃣ Obteniendo PUUID...")
        puuid_data = obtener_puuid(game_name, tag_line)
        puuid = puuid_data['puuid']
        print(f"   ✅ PUUID: {puuid}")

        print(f"\n2️⃣ Obteniendo Summoner ID...")
        summoner_data = obtener_summoner(puuid)
        summoner_id = summoner_data['id']
        print(f"   ✅ Summoner ID: {summoner_id}")

        # Obtener maestrías
        print(f"\n3️⃣ Obteniendo maestrías de Riot API...")
        maestrias = obtener_maestrias(summoner_id)
        print(f"   ✅ Total maestrías recibidas: {len(maestrias)}")
        if maestrias:
            print(f"   📊 Primeras 3:")
            for i, m in enumerate(maestrias[:3], 1):
                print(f"      {i}. Champion ID {m.get('championId')} - Nivel {m.get('championLevel')} - {m.get('championPoints')} puntos")

        # Procesar y devolver top 3 maestrías con nombre del campeón
        print(f"\n4️⃣ Buscando nombres de campeones en BD...")
        top_maestrias = []
        for i, maestria in enumerate(maestrias[:3], 1):
            champ_id = maestria['championId']
            try:
                campeon = Campeon.objects.get(champion_id=champ_id)
                print(f"   ✅ Champion {champ_id} encontrado: {campeon.nombre}")
                top_maestrias.append({
                    "campeon": campeon.nombre,
                    "championId": maestria['championId'],
                    "nivel": maestria['championLevel'],
                    "puntos": maestria['championPoints'],
                })
            except Campeon.DoesNotExist:
                print(f"   ⚠️ Champion {champ_id} NO encontrado en BD")

        print(f"\n5️⃣ Resultado final: {len(top_maestrias)} maestrías procesadas")
        print(f"{'='*60}\n")
        return Response(top_maestrias)

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        print(f"{'='*60}\n")
        import traceback
        traceback.print_exc()
        # Retornar array vacío si falla (para que no bloquee la UI)
        return Response([], status=status.HTTP_200_OK)


@api_view(["GET"])
def partida_detalle(request, match_id):
    detalle = detalle_partida(match_id)
    if detalle is None:
        return Response({"error": "Partida no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    return Response(detalle)

@api_view(["POST"])
def actualizar_invocador(request, game_name, tag_line):
    try:
        invocador = sincronizar_historial(game_name, tag_line, count=10)
        return Response({"mensaje": f"Actualizado {invocador.riot_id}"})
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            return Response(
                {"error": f"No se encontró el invocador {game_name}#{tag_line}"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {"error": f"Error al consultar Riot API (status {e.response.status_code})"},
            status=status.HTTP_502_BAD_GATEWAY,
        )