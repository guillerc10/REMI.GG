import os
import requests
from django.utils import timezone
from .models import Invocador, Liga, Partida, Campeon, Participante

RIOT_API_KEY = os.environ.get("RIOT_API_KEY")

HOST_REGIONAL = "https://americas.api.riotgames.com"  # ACCOUNT-V1, MATCH-V5
HOST_PLATAFORMA = "https://la1.api.riotgames.com"      # SUMMONER-V4, LEAGUE-V4

HEADERS = {"X-Riot-Token": RIOT_API_KEY}


def obtener_puuid(game_name, tag_line):
    url = f"{HOST_REGIONAL}/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()  # {puuid, gameName, tagLine}


def obtener_summoner(puuid):
    url = f"{HOST_PLATAFORMA}/lol/summoner/v4/summoners/by-puuid/{puuid}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()  # {id, puuid, summonerLevel, profileIconId, ...}


def obtener_ligas(puuid):
    url = f"{HOST_PLATAFORMA}/lol/league/v4/entries/by-puuid/{puuid}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()  # lista de ligas (solo/duo, flex, etc.)


def sincronizar_invocador(game_name, tag_line):
    """
    Trae los datos base del invocador desde Riot API y los guarda/actualiza en Postgres.
    Devuelve la instancia de Invocador.
    """
    cuenta = obtener_puuid(game_name, tag_line)
    puuid = cuenta["puuid"]

    summoner = obtener_summoner(puuid)

    invocador, _ = Invocador.objects.update_or_create(
        puuid=puuid,
        defaults={
            "riot_id": f"{game_name}#{tag_line}",
            "game_name": game_name,
            "tag_line": tag_line,
            "summoner_level": summoner["summonerLevel"],
            "profile_icon_id": summoner["profileIconId"],
        },
    )

    ligas = obtener_ligas(puuid)
    for liga_data in ligas:
        Liga.objects.update_or_create(
            invocador=invocador,
            queue_type=liga_data["queueType"],
            defaults={
                "tier": liga_data["tier"],
                "rank": liga_data["rank"],
                "league_points": liga_data["leaguePoints"],
                "wins": liga_data["wins"],
                "losses": liga_data["losses"],
            },
        )

    return invocador