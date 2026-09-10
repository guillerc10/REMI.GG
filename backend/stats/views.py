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
def comparar_invocadores(request):
    game_name_1 = request.GET.get("game_name_1")
    tag_line_1 = request.GET.get("tag_line_1")
    game_name_2 = request.GET.get("game_name_2")
    tag_line_2 = request.GET.get("tag_line_2")

    if not all([game_name_1, tag_line_1, game_name_2, tag_line_2]):
        return Response(
            {"error": "Faltan parámetros: game_name_1, tag_line_1, game_name_2, tag_line_2"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    inv1, error1 = _obtener_invocador_o_sincronizar(game_name_1, tag_line_1)
    if error1:
        return error1

    inv2, error2 = _obtener_invocador_o_sincronizar(game_name_2, tag_line_2)
    if error2:
        return error2

    return Response({
        "jugador_1": {
            "riot_id": inv1.riot_id,
            "winrate": calcular_winrate(inv1),
            "kda": calcular_kda_promedio(inv1),
        },
        "jugador_2": {
            "riot_id": inv2.riot_id,
            "winrate": calcular_winrate(inv2),
            "kda": calcular_kda_promedio(inv2),
        },
    })  

@api_view(["GET"])
def historial_invocador(request, game_name, tag_line):
    invocador, error = _obtener_invocador_o_sincronizar(game_name, tag_line)
    if error:
        return error
    return Response(historial_partidas(invocador))

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