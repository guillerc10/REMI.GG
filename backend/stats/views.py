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


def _obtener_invocador_o_sincronizar(game_name, tag_line):
    riot_id = f"{game_name}#{tag_line}"
    try:
        return Invocador.objects.get(riot_id=riot_id), None
    except Invocador.DoesNotExist:
        try:
            invocador = sincronizar_historial(game_name, tag_line, count=10)
            return invocador, None
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 404:
                return None, Response(
                    {"error": f"No se encontró el invocador {riot_id}"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            return None, Response(
                {"error": "Error al consultar Riot API"},
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