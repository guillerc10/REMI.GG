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
    modo_juego = models.CharField(max_length=30)  # ej: CLASSIC, ARAM

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

    class Meta:
        unique_together = ("partida", "invocador")

    def __str__(self):
        return f"{self.invocador.riot_id} en {self.partida.match_id}"