from django.db import models

class Invocador(models.Model):
    puuid = models.CharField(max_length=100, unique=True)
    riot_id = models.CharField(max_length=100)  # ej: "Nombre#TAG"
    game_name = models.CharField(max_length=50)
    tag_line = models.CharField(max_length=10)
    summoner_level = models.IntegerField(default=0)
    profile_icon_id = models.IntegerField(default=0)
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.riot_id


class Liga(models.Model):
    invocador = models.ForeignKey(Invocador, on_delete=models.CASCADE, related_name="ligas")
    queue_type = models.CharField(max_length=30)  # ej: RANKED_SOLO_5x5
    tier = models.CharField(max_length=20)         # ej: GOLD
    rank = models.CharField(max_length=5)          # ej: II
    league_points = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.invocador.riot_id} - {self.tier} {self.rank}"



class Partida(models.Model):
    match_id = models.CharField(max_length=50, unique=True)
    fecha = models.DateTimeField()
    duracion_segundos = models.IntegerField()
    modo_juego = models.CharField(max_length=30)
    queue_id = models.IntegerField(default=0)

    def __str__(self):
        return self.match_id


class Campeon(models.Model):
    champion_id = models.IntegerField(unique=True)
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre


class Participante(models.Model):
    partida = models.ForeignKey(Partida, on_delete=models.CASCADE, related_name="participantes")
    invocador = models.ForeignKey(Invocador, on_delete=models.CASCADE, related_name="participaciones")
    campeon = models.ForeignKey(Campeon, on_delete=models.SET_NULL, null=True)
    kills = models.IntegerField(default=0)
    deaths = models.IntegerField(default=0)
    assists = models.IntegerField(default=0)
    win = models.BooleanField(default=False)
    team_id = models.IntegerField()  # 100 o 200
    role = models.CharField(max_length=20, default="")  # TOP, JUNGLE, MIDDLE, BOTTOM, UTILITY
    queue_id = models.IntegerField(default=0)

    # Nuevo: items (7 slots, incluyendo trinket)
    item0 = models.IntegerField(default=0)
    item1 = models.IntegerField(default=0)
    item2 = models.IntegerField(default=0)
    item3 = models.IntegerField(default=0)
    item4 = models.IntegerField(default=0)
    item5 = models.IntegerField(default=0)
    item6 = models.IntegerField(default=0)  # trinket

    # Nuevo: hechizos de invocador
    summoner1_id = models.IntegerField(default=0)
    summoner2_id = models.IntegerField(default=0)

    # Nuevo: runas (solo las principales, para simplificar)
    runa_principal = models.IntegerField(default=0)  # keystone
    runa_secundaria = models.IntegerField(default=0)  # árbol secundario

    # Nuevo: CS y otros datos útiles para badges
    cs_total = models.IntegerField(default=0)
    doble_kills = models.IntegerField(default=0)
    triple_kills = models.IntegerField(default=0)
    quadra_kills = models.IntegerField(default=0)
    penta_kills = models.IntegerField(default=0)

    # Nuevo: LP ganados/perdidos en ranked (puede ser negativo)
    lp_change = models.IntegerField(default=0)  # +15, -18, 0 en normales

    # Nuevo: Daño a campeones enemigos
    damage_to_champions = models.IntegerField(default=0)

    class Meta:
        unique_together = ("partida", "invocador")

    def __str__(self):
        return f"{self.invocador.riot_id} en {self.partida.match_id}"