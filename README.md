# 🎮 REMI.GG - League of Legends Statistics Platform

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-0.1.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

Una **plataforma web completa** para consultar, analizar y comparar estadísticas en tiempo real de jugadores de League of Legends. Integrada directamente con la **Riot API**, la plataforma sincroniza datos de invocadores, historial de partidas, campiones y proporciona análisis detallados de rendimiento.

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Stack de Tecnologías](#stack-de-tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Endpoints de la API](#endpoints-de-la-api)
- [Cómo Ejecutar](#cómo-ejecutar)
- [Variables de Entorno](#variables-de-entorno)
- [Modelo de Datos](#modelo-de-datos)
- [Flujo de Datos](#flujo-de-datos)
- [Contribución](#contribución)

---

## 📱 Descripción General

**REMI.GG** es una aplicación fullstack que proporciona un análisis profundo de las estadísticas de jugadores de League of Legends. El sistema:

1. **Consulta la Riot API** para obtener datos en tiempo real de invocadores
2. **Almacena información persistente** en una base de datos PostgreSQL
3. **Calcula estadísticas** complejas: winrate, KDA, desempeño por campeón, etc.
4. **Visualiza datos** de forma intuitiva a través de una interfaz React moderna
5. **Compara jugadores** lado a lado para análisis competitivo

### Casos de Uso

- 📊 Analizar tu propio desempeño y progresión
- 🔍 Investigar jugadores antes de enfrentarlos en ranked
- 🏆 Comparar estadísticas entre dos jugadores
- 📈 Seguir el historial completo de partidas
- 🎯 Identificar campeones fuertes y áreas de mejora

---

## ✨ Características Principales

### 🔄 Sincronización de Datos
- Búsqueda de invocadores por nombre y tag (ej: `Faker#KR1`)
- Caché inteligente que evita llamadas redundantes a Riot API
- Actualización automática de datos cuando caducan
- Historial completo de las últimas 10 partidas

### 📊 Análisis Avanzados
- **Winrate general** y por cola de juego
- **KDA promedio** (Kills, Deaths, Assists)
- **Estadísticas por campeón** con desempeño individual
- **Compañeros frecuentes** identificación de jugadores habituales
- **Detalle de partidas** con build, runas, hechizos y multikills

### 🎮 Comparador de Jugadores
- Comparación lado a lado de dos invocadores
- Análisis de winrate y KDA comparativo
- Identificación de fortalezas y debilidades

### 🎨 Interfaz Moderna
- Diseño responsivo con Tailwind CSS
- Componentes React reutilizables
- Carga rápida con Vite
- Experiencia de usuario optimizada

---

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────────────┐
│                    Cliente (Frontend)                        │
│          React + Vite + Tailwind CSS                        │
│  (Interfaz de usuario, gráficos, búsqueda de invocadores)   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP / REST API
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Servidor (Backend)                          │
│         Django + Django REST Framework                       │
│  (Lógica de negocio, cálculos, sincronización)              │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌─────────┐ ┌─────────┐ ┌──────────┐
   │PostgreSQL│ │Riot API │ │  Cache   │
   │  (DB)   │ │(v1-v5)  │ │(Memoria) │
   └─────────┘ └─────────┘ └──────────┘
```

### Componentes Clave

**Frontend:**
- `src/` - Componentes React y páginas
- `public/` - Recursos estáticos

**Backend:**
- `stats/` - Aplicación principal de Django
  - `models.py` - Definición de modelos ORM
  - `views.py` - Endpoints de la API REST
  - `services.py` - Lógica de sincronización con Riot API
  - `analytics.py` - Cálculos y análisis de estadísticas
- `lolstats_project/` - Configuración principal de Django

**Base de Datos:**
- PostgreSQL con tablas para: Invocadores, Ligas, Partidas, Campeones, Participantes

---

## 🛠️ Stack de Tecnologías

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **Django** | 6.1+ | Framework web Python |
| **Django REST Framework** | 3.18+ | API REST y serialización |
| **PostgreSQL** | - | Base de datos relacional |
| **psycopg2** | 2.9+ | Adaptador PostgreSQL para Python |
| **requests** | 2.34+ | Llamadas HTTP a Riot API |
| **python-dotenv** | 1.2+ | Gestión de variables de entorno |
| **django-cors-headers** | 4.9+ | CORS para comunicación frontend-backend |
| **NumPy** | 2.5+ | Cálculos numéricos y estadísticas |

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **React** | 19.2+ | Librería de UI |
| **Vite** | 8.2+ | Build tool y dev server |
| **Tailwind CSS** | 4.3+ | Framework de estilos CSS |
| **Axios** | 1.20+ | Cliente HTTP para API calls |
| **ESLint** | 10.9+ | Linter de código |

### Herramientas Adicionales

- **Poetry** - Gestor de dependencias Python
- **Postman** - Colecciones para testing de API
- **Git** - Control de versiones

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Python 3.14+** (para el backend)
- **Node.js 18+** (para el frontend)
- **PostgreSQL 12+** (base de datos)
- **Git** (control de versiones)
- **API Key de Riot** (para acceso a datos)

### Obtener API Key de Riot

1. Ve a [Riot Developer Portal](https://developer.riotgames.com/)
2. Crea una cuenta o inicia sesión
3. Genera una API Key
4. Guarda la clave para configurarla más tarde

---

## 🚀 Instalación y Configuración

### Backend

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/tuusuario/REMI.GG.git
cd REMI.GG/backend
```

#### 2. Crear Entorno Virtual
```bash
python3 -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
```

#### 3. Instalar Dependencias
```bash
pip install poetry
poetry install
```

#### 4. Configurar Base de Datos
```bash
# Crear base de datos PostgreSQL
createdb remi_gg

# Aplicar migraciones
python manage.py migrate
```

#### 5. Crear Superusuario (Opcional)
```bash
python manage.py createsuperuser
```

#### 6. Configurar Variables de Entorno
Crea un archivo `.env` en `backend/`:
```env
RIOT_API_KEY=tu_api_key_aqui
DB_NAME=remi_gg
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
DJANGO_SECRET_KEY=tu_secret_key_aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

#### 7. Ejecutar Backend
```bash
python manage.py runserver
```
El servidor estará disponible en `http://localhost:8000`

---

### Frontend

#### 1. Navegar a Directorio Frontend
```bash
cd REMI.GG/frontend
```

#### 2. Instalar Dependencias
```bash
npm install
```

#### 3. Configurar Variables de Entorno
Crea un archivo `.env` en `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

#### 4. Ejecutar Development Server
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

#### 5. Build para Producción
```bash
npm run build
```

---

## 📂 Estructura del Proyecto

```
REMI.GG/
│
├── backend/                          # Aplicación Django (Backend)
│   ├── .env                          # Variables de entorno
│   ├── .venv/                        # Entorno virtual Python
│   ├── manage.py                     # Script de gestión Django
│   ├── poetry.lock                   # Dependencias bloqueadas
│   ├── pyproject.toml                # Configuración de dependencias
│   │
│   ├── lolstats_project/             # Configuración principal Django
│   │   ├── settings.py               # Configuración del proyecto
│   │   ├── urls.py                   # Rutas principales
│   │   ├── asgi.py                   # Configuración ASGI
│   │   └── wsgi.py                   # Configuración WSGI
│   │
│   └── stats/                        # Aplicación principal
│       ├── models.py                 # Modelos ORM (BD)
│       ├── views.py                  # Vistas/Endpoints API
│       ├── serializers.py            # Serializadores DRF
│       ├── services.py               # Lógica de sincronización
│       ├── analytics.py              # Cálculos y análisis
│       ├── urls.py                   # Rutas de stats
│       ├── admin.py                  # Configuración admin
│       └── migrations/               # Migraciones de BD
│
├── frontend/                         # Aplicación React (Frontend)
│   ├── .env                          # Variables de entorno
│   ├── package.json                  # Dependencias npm
│   ├── vite.config.js                # Configuración Vite
│   ├── tailwind.config.js            # Configuración Tailwind
│   │
│   ├── src/
│   │   ├── main.jsx                  # Punto de entrada
│   │   ├── App.jsx                   # Componente principal
│   │   ├── App.css                   # Estilos principales
│   │   │
│   │   ├── components/               # Componentes reutilizables
│   │   │   ├── SearchBar.jsx
│   │   │   ├── PlayerCard.jsx
│   │   │   ├── Statistics.jsx
│   │   │   └── Comparator.jsx
│   │   │
│   │   ├── pages/                    # Páginas de la aplicación
│   │   │   ├── Home.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Compare.jsx
│   │   │   └── MatchDetails.jsx
│   │   │
│   │   └── services/                 # Servicios API
│   │       └── api.js                # Cliente Axios
│   │
│   └── public/                       # Archivos estáticos
│
├── postman/                          # Colecciones Postman
│   ├── REMI.GG API.postman_collection.json
│   └── REMI.GG Local.postman_environment.json
│
├── README.md                         # Este archivo
├── PRIMER COMMIT.txt                 # Documentación inicial
├── TECNOLOGIAS.png                   # Diagrama de tecnologías
└── .gitignore                        # Archivos a ignorar en git
```

---

## 🔌 Endpoints de la API

### Base URL: `http://localhost:8000/api/`

#### Perfil del Invocador
```
GET /perfil/<game_name>/<tag_line>/
Retorna: Información básica del invocador
Ejemplo: /perfil/Faker/KR1/
```

#### Ligas del Invocador
```
GET /ligas/<game_name>/<tag_line>/
Retorna: Información de rangos y ligas
Ejemplo: /ligas/Faker/KR1/
```

#### Winrate
```
GET /winrate/<game_name>/<tag_line>/
Retorna: 
{
  "winrate_general": 52.5,
  "total_partidas": 100,
  "wins": 53,
  "losses": 47
}
```

#### KDA Promedio
```
GET /kda/<game_name>/<tag_line>/
Retorna:
{
  "kda_promedio": 3.2,
  "kills_promedio": 5.1,
  "deaths_promedio": 3.8,
  "assists_promedio": 8.5
}
```

#### Estadísticas por Campeón
```
GET /campeones/<game_name>/<tag_line>/
Retorna: Array de campeones con winrate y stats individuales
```

#### Compañeros Frecuentes
```
GET /companeros/<game_name>/<tag_line>/
Retorna: Lista de jugadores que juegan frecuentemente juntos
```

#### Historial de Partidas
```
GET /historial/<game_name>/<tag_line>/
Retorna: Lista de últimas partidas jugadas
```

#### Detalle de Partida
```
GET /partida/<match_id>/
Retorna: Información completa de una partida específica
```

#### Comparar Invocadores
```
GET /comparar/?game_name_1=Faker&tag_line_1=KR1&game_name_2=Caps&tag_line_2=EU1
Retorna: Comparación directa de dos jugadores
```

#### Actualizar Invocador
```
POST /actualizar/<game_name>/<tag_line>/
Retorna: Confirmación de actualización de datos
```

---

## ▶️ Cómo Ejecutar

### Ejecución Local (Desarrollo)

#### Terminal 1 - Backend
```bash
cd backend
source .venv/bin/activate
python manage.py runserver
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Luego abre tu navegador en `http://localhost:5173`

### Ejecución con Docker (Opcional)

```bash
# Construir imagen
docker-compose build

# Ejecutar servicios
docker-compose up
```

---

## 🔐 Variables de Entorno

### Backend (`.env`)

```env
# Riot API
RIOT_API_KEY=RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Base de Datos PostgreSQL
DB_ENGINE=django.db.backends.postgresql
DB_NAME=remi_gg
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432

# Django
SECRET_KEY=tu-clave-secreta-muy-larga-y-aleatoria
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (`.env`)

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=REMI.GG
```

---

## 🗄️ Modelo de Datos

### Tablas Principales

#### `stats_invocador`
Información básica del jugador
```python
- puuid: Identificador único de Riot
- riot_id: Nombre#Tag (Faker#KR1)
- game_name: Nombre del invocador
- tag_line: Etiqueta personalizada
- summoner_level: Nivel de invocador
- profile_icon_id: ID del icono de perfil
- ultima_actualizacion: Timestamp del último sync
```

#### `stats_liga`
Información de rangos y ligas
```python
- invocador: FK a Invocador
- queue_type: RANKED_SOLO_5x5, RANKED_FLEX_SR, etc.
- tier: IRON, BRONZE, SILVER, GOLD, PLATINUM, EMERALD, DIAMOND, MASTER, GRANDMASTER
- rank: I, II, III, IV
- league_points: LP acumulados
- wins: Victorias en esa liga
- losses: Derrotas en esa liga
```

#### `stats_partida`
Información de cada partida
```python
- match_id: Identificador único de la partida
- fecha: Timestamp de la partida
- duracion_segundos: Duración en segundos
- modo_juego: CLASSIC, ARAM, ARENA, etc.
- queue_id: ID de la cola
```

#### `stats_participante`
Desempeño del jugador en cada partida
```python
- partida: FK a Partida
- invocador: FK a Invocador
- campeon: FK a Campeón
- kills, deaths, assists: KDA
- win: Resultado de la partida
- team_id: 100 (Blue) o 200 (Red)
- role: TOP, JUNGLE, MIDDLE, BOTTOM, UTILITY
- items: item0-item6 (items y trinket)
- summoner1_id, summoner2_id: Hechizos de invocador
- runa_principal, runa_secundaria: Runas
- cs_total: Minions asesinados
- multikills: doble_kills, triple_kills, etc.
```

#### `stats_campeon`
Catálogo de campeones
```python
- champion_id: ID del campeón en Riot
- nombre: Nombre del campeón
```

---

## 📊 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. BÚSQUEDA: Usuario busca "Faker#KR1"                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│ 2. VERIFICACIÓN: ¿Existe en BD y está actualizado?             │
│   ├─ SÍ → Ir a paso 5                                           │
│   └─ NO → Continuar                                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│ 3. RIOT API - Obtener datos:                                    │
│   ├─ ACCOUNT-V1: PUUID                                         │
│   ├─ SUMMONER-V4: Nivel, icono                                 │
│   ├─ LEAGUE-V4: Rango, LP                                      │
│   └─ MATCH-V5: Historial de 10 partidas                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│ 4. ALMACENAMIENTO: Guardar/Actualizar en PostgreSQL             │
│   ├─ Invocador                                                  │
│   ├─ Liga                                                       │
│   ├─ Partidas                                                   │
│   └─ Participantes                                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│ 5. ANÁLISIS: Calcular estadísticas                              │
│   ├─ Winrate                                                    │
│   ├─ KDA                                                        │
│   ├─ Stats por campeón                                         │
│   └─ Compañeros frecuentes                                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│ 6. RESPUESTA: Retornar JSON al Frontend                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│ 7. VISUALIZACIÓN: React renderiza el perfil                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing

### Probar API con Postman

1. Importa la colección en `postman/REMI.GG API.postman_collection.json`
2. Configura el ambiente local con `postman/REMI.GG Local.postman_environment.json`
3. Ejecuta los requests

### Ejecutar Tests
```bash
cd backend
python manage.py test
```

---

## 🐛 Troubleshooting

### Error: "No se puede conectar a PostgreSQL"
```bash
# Verificar que PostgreSQL está corriendo
psql -U postgres

# Crear BD si no existe
createdb remi_gg
```

### Error: "Invalid API Key"
- Verifica que tu `RIOT_API_KEY` es válida
- Las keys de desarrollo expiran después de 24 horas

### Error: "CORS errors"
- Verifica que `CORS_ALLOWED_ORIGINS` en backend incluye tu URL frontend
- Reinicia el servidor backend

### Frontend no conecta con Backend
- Verifica que `VITE_API_BASE_URL` es correcta
- Asegúrate que backend está corriendo en puerto 8000

---

## 📈 Roadmap

- [ ] Autenticación de usuarios
- [ ] Guardar invocadores favoritos
- [ ] Gráficos de progresión en el tiempo
- [ ] Análisis de campeones por rol
- [ ] Predictor de rango basado en datos
- [ ] Sistema de notificaciones
- [ ] Estadísticas compartibles
- [ ] Aplicación móvil
- [ ] Caché distribuido (Redis)
- [ ] Dashboard de admin mejorado

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Para reportar bugs o sugerir features:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/tu-feature`)
3. Commit tus cambios (`git commit -m 'Agrega feature'`)
4. Push a la rama (`git push origin feature/tu-feature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 📧 Contacto

- **Autor**: guillerc10
- **Email**: guillermocaceres164@gmail.com
- **GitHub**: [@guillerc10](https://github.com/guillerc10)

---

## 📚 Referencias

- [Riot API Documentation](https://developer.riotgames.com/docs/lol)
- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

**Hecho con ❤️ por la comunidad de League of Legends**
