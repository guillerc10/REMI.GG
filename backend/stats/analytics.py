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