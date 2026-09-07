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



def obtener_match_ids(puuid, count=10):
    url = f"{HOST_REGIONAL}/lol/match/v5/matches/by-puuid/{puuid}/ids"
    params = {"count": count}
    response = requests.get(url, headers=HEADERS, params=params)
    response.raise_for_status()
    return response.json()  # lista de match_ids, ej: ["LA1_123456789", ...]


def obtener_detalle_partida(match_id):
    url = f"{HOST_REGIONAL}/lol/match/v5/matches/{match_id}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()  # objeto completo con info + metadata


def guardar_campeon(champion_id, champion_name):
    campeon, _ = Campeon.objects.update_or_create(
        champion_id=champion_id,
        defaults={"nombre": champion_name},
    )
    return campeon


def sincronizar_partida(match_id):
    """
    Trae el detalle de una partida, la guarda junto con sus 10 participantes.
    Si la partida ya existe, no la duplica.
    """
    if Partida.objects.filter(match_id=match_id).exists():
        return Partida.objects.get(match_id=match_id)

    data = obtener_detalle_partida(match_id)
    info = data["info"]

    partida = Partida.objects.create(
        match_id=match_id,
        fecha=timezone.datetime.fromtimestamp(info["gameStartTimestamp"] / 1000, tz=timezone.UTC),        duracion_segundos=info["gameDuration"],
        modo_juego=info["gameMode"],
    )

    for p in info["participants"]:
        campeon = guardar_campeon(p["championId"], p["championName"])

        # Solo creamos el Invocador si no existe (participantes que no hemos sincronizado antes)
        invocador, _ = Invocador.objects.get_or_create(
            puuid=p["puuid"],
            defaults={
                "riot_id": f"{p['riotIdGameName']}#{p['riotIdTagline']}",
                "game_name": p["riotIdGameName"],
                "tag_line": p["riotIdTagline"],
                "summoner_level": p["summonerLevel"],
                "profile_icon_id": p["profileIcon"],
            },
        )

        Participante.objects.update_or_create(
            partida=partida,
            invocador=invocador,
            defaults={
                "campeon": campeon,
                "kills": p["kills"],
                "deaths": p["deaths"],
                "assists": p["assists"],
                "win": p["win"],
                "team_id": p["teamId"],
                "role": p["teamPosition"],
                "item0": p["item0"],
                "item1": p["item1"],
                "item2": p["item2"],
                "item3": p["item3"],
                "item4": p["item4"],
                "item5": p["item5"],
                "item6": p["item6"],
                "summoner1_id": p["summoner1Id"],
                "summoner2_id": p["summoner2Id"],
                "runa_principal": p["perks"]["styles"][0]["selections"][0]["perk"],
                "runa_secundaria": p["perks"]["styles"][1]["style"],
                "cs_total": p["totalMinionsKilled"] + p.get("neutralMinionsKilled", 0),
                "doble_kills": p["doubleKills"],
                "triple_kills": p["tripleKills"],
                "quadra_kills": p["quadraKills"],
                "penta_kills": p["pentaKills"],
            },
        )

    return partida


def sincronizar_historial(game_name, tag_line, count=10):
    """
    Sincroniza el invocador y sus últimas `count` partidas.
    """
    invocador = sincronizar_invocador(game_name, tag_line)
    match_ids = obtener_match_ids(invocador.puuid, count=count)

    for match_id in match_ids:
        sincronizar_partida(match_id)

    return invocador