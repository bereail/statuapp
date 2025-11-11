# 🗺️ StatuApp Theme — Rosario en Mapas

**Tema / plantilla oficial de StatuApp**  
Catálogo interactivo de estatuas y monumentos de **Rosario (Argentina)** con **mapa**, **búsqueda avanzada**, y **fichas** con información histórica, autor, barrio, año y material.

👉 **Demo online:** próximamente en [statuapp.vercel.app](https://statuapp.vercel.app)

---

## ✨ Funcionalidades principales

- 🔎 **Búsqueda** por nombre, autor o barrio  
- 🗺️ **Mapa interactivo** con marcadores y popups  
- 🧱 **Filtros** por barrio, material o época  
- 📜 **Fichas detalladas** con fotos, descripción y ubicación  
- ⚡ **Rendimiento optimizado** (Next.js + ISR)  
- 🌙 **Diseño responsive y accesible** (Tailwind + shadcn/ui)

---

## 🧰 Stack tecnológico

| Área | Tecnología |
|------|-------------|
| Frontend | [Next.js 15/16](https://nextjs.org/) + TypeScript |
| UI | [TailwindCSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Mapa | [Leaflet](https://leafletjs.com/) / [Mapbox](https://www.mapbox.com/) |
| Datos | JSON local (`/data/statues.json`) o API externa |
| Deploy | [Vercel](https://vercel.com/) / [Netlify](https://www.netlify.com/) |

---

## 🏗️ Estructura del proyecto

statuAppTheme/
├─ app/ # Rutas y layouts (App Router)
├─ components/ # UI reutilizable (Cards, Map, etc.)
├─ data/ # Dataset de ejemplo de monumentos
├─ lib/ # Funciones y helpers (fetcher, filtros)
├─ public/ # Imágenes y assets
└─ README.md

yaml
Copiar código

---

## ⚙️ Cómo correrlo localmente

```bash
# 1️⃣ Instalar dependencias
npm install        # o pnpm/yarn

# 2️⃣ Configurar entorno
cp .env.example .env.local
# Variables necesarias:
# NEXT_PUBLIC_MAPBOX_TOKEN=tu_token_aqui
# NEXT_PUBLIC_API_URL=http://localhost:8000/api (opcional)

# 3️⃣ Ejecutar en modo desarrollo
npm run dev

# 4️⃣ Abrir en el navegador
http://localhost:3000
🗃️ Dataset de ejemplo
El archivo /data/statues.json contiene un extracto de monumentos de Rosario:

json
Copiar código
[
  {
    "slug": "monumento-a-la-bandera",
    "titulo": "Monumento Nacional a la Bandera",
    "autor": "Ángel Guido",
    "barrio": "Centro",
    "material": "Piedra y mármol",
    "anio": 1957,
    "lat": -32.947,
    "lng": -60.630,
    "imagen": "/images/monumento.jpg"
  }
]
📍 Los datos son de dominio público (fuentes municipales). Licencia CC-BY 4.0.

📸 Capturas (pendientes)
Agregá capturas en /docs/screenshots/ y actualizá acá:

Vista	Imagen
Home	
Detalle	
Mapa	

🚀 Roadmap
 Búsqueda y filtros

 Mapa con marcadores

 Favoritos de usuario

 Exportar dataset (GeoJSON / CSV)

 Soporte multi-idioma

🪪 Licencias
Código: MIT

Datos e imágenes: CC-BY 4.0

👩‍💻 Autora
Berenice Solohaga
Full Stack Developer · Rosario, Argentina
LinkedIn · Portfolio

---

