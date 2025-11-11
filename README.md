# 🗿 StatuApp — Rosario en Estatuas

**Proyecto cultural interactivo** desarrollado por **Berenice Solohaga**  
Plataforma que reúne **estatuas y monumentos de Rosario (Argentina)** en un **catálogo web con mapa, fichas y QR** para explorar la historia local.

---

## ✨ Objetivo

Difundir y poner en valor el **patrimonio escultórico** de la ciudad mediante una aplicación web accesible y moderna, que combina **datos abiertos**, **geolocalización** y **diseño responsivo**.

---

## 🧰 Stack Tecnológico

| Área | Tecnologías |
|------|--------------|
| **Frontend** | Next.js · React · TailwindCSS · Leaflet · TypeScript |
| **Backend** | Django REST Framework · SQLite/MySQL |
| **Datos** | Dataset JSON propio de monumentos (1500+ registros) |
| **Infraestructura** | Vercel (frontend) · Render (API) |

---

## 🗺️ Funcionalidades Principales

- 🔎 Búsqueda por nombre, autor, barrio o material  
- 🗺️ Mapa interactivo con marcadores geolocalizados  
- 🧱 Fichas con datos históricos, autoría, material y año  
- 📱 Código QR en cada monumento para acceder desde el celular  
- 🧠 Dataset curado manualmente con referencias municipales  

---

## 🏗️ Estructura del Proyecto

statuApp/
├── backend/ # API REST (Django + DRF)
├── frontend/ # Interfaz web (Next.js)
├── data/ # Dataset CSV/JSON de estatuas
├── db/ # Base de datos SQLite de respaldo
└── presentación/ # Documentación y material de difusión

yaml
Copiar código

---

## ⚙️ Cómo ejecutarlo localmente

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Frontend
bash
Copiar código
cd frontend
npm install
npm run dev
# http://localhost:3000
⚠️ Si usás variables de entorno, agregá un archivo .env.local con:

ini
Copiar código
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
📸 Capturas
Vista principal	Ficha de monumento	Mapa interactivo

🎥 Demo en video: Ver presentación

🧭 Roadmap
 Búsqueda por texto

 Mapa interactivo

 Códigos QR

 Panel de administración para curadores

 Modo offline (PWA)

👩‍💻 Autora
Berenice Solohaga
Desarrolladora Full Stack · Rosario, Argentina
🌐 Portfolio
💼 LinkedIn

🪪 Licencias
Código: MIT

Datos e imágenes: CC-BY 4.0 (fuentes municipales y relevamiento propio)
