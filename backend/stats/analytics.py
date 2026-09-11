from django.db.models import Count, Q
from .models import Participante


def calcular_winrate(invocador):
    """
    Devuelve el winrate del invocador como porcentaje (0-100),
    junto con el total de partidas jugadas.
    """
    participaciones = Participante.objects.filter(invocador=invocador)
    total = participaciones.count()

    if total == 0:
        return {"winrate": 0, "victorias": 0, "derrotas": 0, "total": 0}

    victorias = participaciones.filter(win=True).count()
    derrotas = total - victorias
    winrate = round((victorias / total) * 100, 1)

    return {
        "winrate": winrate,
        "victorias": victorias,
        "derrotas": derrotas,
        "total": total,
    }


def calcular_kda_promedio(invocador):
    """
    Devuelve el KDA promedio (kills, deaths, assists) y el ratio KDA.
    """
    participaciones = Participante.objects.filter(invocador=invocador)
    total = participaciones.count()

    if total == 0:
        return {"kills_prom": 0, "deaths_prom": 0, "assists_prom": 0, "kda_ratio": 0}

    total_kills = sum(p.kills for p in participaciones)
    total_deaths = sum(p.deaths for p in participaciones)
    total_assists = sum(p.assists for p in participaciones)

    kills_prom = round(total_kills / total, 1)
    deaths_prom = round(total_deaths / total, 1)
    assists_prom = round(total_assists / total, 1)

    # Evitar división entre cero si deaths_prom es 0
    kda_ratio = round((kills_prom + assists_prom) / deaths_prom, 2) if deaths_prom > 0 else (kills_prom + assists_prom)

    return {
        "kills_prom": kills_prom,
        "deaths_prom": deaths_prom,
        "assists_prom": assists_prom,
        "kda_ratio": kda_ratio,
    }


def stats_por_campeon(invocador):
    """
    Devuelve una lista de stats agrupadas por campeón: partidas jugadas,
    victorias, winrate por campeón.
    """
    participaciones = Participante.objects.filter(invocador=invocador)

    resultado = (
        participaciones
        .values("campeon__nombre")
        .annotate(
            partidas=Count("id"),
            victorias=Count("id", filter=Q(win=True)),
        )
        .order_by("-partidas")
    )

    stats = []
    for r in resultado:
        winrate = round((r["victorias"] / r["partidas"]) * 100, 1) if r["partidas"] > 0 else 0
        stats.append({
            "campeon": r["campeon__nombre"],
            "partidas": r["partidas"],
            "victorias": r["victorias"],
            "winrate": winrate,
        })

    return stats


def companeros_frecuentes(invocador):
    """
    Devuelve los invocadores con los que más veces se ha jugado
    en el MISMO equipo, junto con el winrate jugando juntos.
    """
    mis_participaciones = Participante.objects.filter(invocador=invocador)

    conteo = {}  # {invocador_id: {"riot_id":..., "partidas":..., "victorias":...}}

    for mia in mis_participaciones:
        companeros = Participante.objects.filter(
            partida=mia.partida,
            team_id=mia.team_id,
        ).exclude(invocador=invocador)

        for c in companeros:
            key = c.invocador.puuid
            if key not in conteo:
                conteo[key] = {
                    "riot_id": c.invocador.riot_id,
                    "partidas": 0,
                    "victorias": 0,
                }
            conteo[key]["partidas"] += 1
            if c.win:
                conteo[key]["victorias"] += 1

    resultado = []
    for data in conteo.values():
        winrate = round((data["victorias"] / data["partidas"]) * 100, 1)
        resultado.append({**data, "winrate": winrate})

    resultado.sort(key=lambda x: x["partidas"], reverse=True)
    return resultado

def calcular_badges(participante):
    """
    Devuelve una lista de badges (etiquetas) para una participación específica,
    basados en su desempeño en esa partida.
    """
    badges = []

    if participante.penta_kills > 0:
        badges.append("PENTAKILL")
    elif participante.quadra_kills > 0:
        badges.append("QUADRA KILL")
    elif participante.triple_kills > 0:
        badges.append("TRIPLE KILL")
    elif participante.doble_kills > 0:
        badges.append("DOBLE KILL")

    # MVP: el mejor KDA de su propio equipo en esa partida
    companeros_equipo = Participante.objects.filter(
        partida=participante.partida,
        team_id=participante.team_id,
    )

    def kda_score(p):
        return (p.kills + p.assists) / max(p.deaths, 1)

    mejor_del_equipo = max(companeros_equipo, key=kda_score)
    if mejor_del_equipo.id == participante.id:
        badges.append("MVP")

    return badges   

def _traducir_queue_id(queue_id):
    """
    Traduce queue_id a nombre de modo de partida más legible.
    Usa queue_id en lugar de gameMode porque es más confiable.
    """
    mapeo = {
        400: "Normal Draft",      # NORMAL_5x5_DRAFT
        420: "Solo/Dúo 5v5",      # RANKED_SOLO_5x5
        430: "Blind Pick",         # NORMAL_5x5_BLIND
        440: "Flex 5v5",          # RANKED_FLEX_SR
        450: "ARAM",              # ARAM_5x5
        700: "Clash",             # CLASH_5x5
        1020: "One for All",      # ONE_FOR_ALL_5x5
        1300: "Nexus Blitz",      # NEXUS_BLITZ_5x5
        1400: "Ultimate Spellbook", # ULTIMATE_SPELLBOOK_5x5
    }
    return mapeo.get(queue_id, f"Unknown ({queue_id})")


def historial_partidas(invocador, limite=10):
    """
    Devuelve una lista de las últimas partidas del invocador, con detalle completo
    para mostrar en el historial visual.
    """
    participaciones = (
        Participante.objects
        .filter(invocador=invocador)
        .select_related("partida", "campeon")
        .order_by("-partida__fecha")[:limite]
    )

    resultado = []
    for p in participaciones:
        resultado.append({
            "match_id": p.partida.match_id,
            "fecha": p.partida.fecha,
            "duracion_segundos": p.partida.duracion_segundos,
            "modo_juego": _traducir_queue_id(p.partida.queue_id),  # Usar queue_id en lugar de gameMode
            "queue_id": p.partida.queue_id,
            "campeon": p.campeon.nombre if p.campeon else None,
            "kills": p.kills,
            "deaths": p.deaths,
            "assists": p.assists,
            "win": p.win,
            "cs_total": p.cs_total,
            "items": [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6],
            "summoner1_id": p.summoner1_id,
            "summoner2_id": p.summoner2_id,
            "lp_change": p.lp_change,  # +15, -18, 0 en normales
            "badges": calcular_badges(p),
        })

    return resultado

def detalle_partida(match_id):
    """
    Devuelve el detalle completo de una partida: los 10 participantes,
    agrupados por equipo, con score total por equipo.
    """
    from .models import Partida

    try:
        partida = Partida.objects.get(match_id=match_id)
    except Partida.DoesNotExist:
        return None

    participantes = (
        Participante.objects
        .filter(partida=partida)
        .select_related("invocador", "campeon")
        .order_by("team_id")
    )

    equipos = {100: [], 200: []}
    score = {100: {"kills": 0, "deaths": 0, "assists": 0, "damage": 0}, 200: {"kills": 0, "deaths": 0, "assists": 0, "damage": 0}}

    for p in participantes:
        equipos[p.team_id].append({
            "riot_id": p.invocador.riot_id,
            "campeon": p.campeon.nombre if p.campeon else None,
            "role": p.role,
            "kills": p.kills,
            "deaths": p.deaths,
            "assists": p.assists,
            "cs_total": p.cs_total,
            "damage_to_champions": p.damage_to_champions,
            "items": [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6],
            "summoner1_id": p.summoner1_id,
            "summoner2_id": p.summoner2_id,
            "win": p.win,
            "badges": calcular_badges(p),
        })
        score[p.team_id]["kills"] += p.kills
        score[p.team_id]["deaths"] += p.deaths
        score[p.team_id]["assists"] += p.assists
        score[p.team_id]["damage"] += p.damage_to_champions

    return {
        "match_id": partida.match_id,
        "fecha": partida.fecha,
        "duracion_segundos": partida.duracion_segundos,
        "modo_juego": partida.modo_juego,
        "equipo_100": {"jugadores": equipos[100], "score": score[100]},
        "equipo_200": {"jugadores": equipos[200], "score": score[200]},
    }