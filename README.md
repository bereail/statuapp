# 🗿 StatuApp — Rosario en Estatuas

**Proyecto cultural interactivo** que reúne estatuas y monumentos de **Rosario (Argentina)**.  
Permite explorar el patrimonio urbano mediante **mapa, búsqueda, fichas informativas y QR en espacio público.**

---

## ✨ Objetivo
Hacer accesible el patrimonio cultural de la ciudad mediante tecnología open-source.

---

## ⚙️ Stack Tecnológico

| Área | Tecnologías |
|------|--------------|
| Frontend | **Next.js** · **React** · **TailwindCSS** · **Leaflet** |
| Backend | **Django REST Framework** · SQLite/MySQL |
| Integración | API interna + dataset JSON + QR dinámicos |
| Deploy | Vercel (frontend) · Render (API) |

---

## 🧩 Estructura del Proyecto
statuApp/
├── frontend/ # Interfaz pública (Next.js)
├── backend/ # API Django REST
├── data/ # Dataset local de monumentos
├── db/ # Base de datos exportada
└── presentación/ # Documentación y diseño

yaml
Copiar código

---

## 🗺️ Funcionalidades
- 🔎 Búsqueda por nombre, autor o barrio  
- 🗺️ Mapa interactivo con marcadores y fichas  
- 📱 QR para acceder a cada monumento desde el celular  
- 🖼️ Galería con imágenes y descripción histórica  
- 🧠 Dataset propio con validación y normalización de datos  

---

## 🚀 Cómo ejecutarlo

### Backend
```bash
cd backend
python -m venv .venv && .venv\Scripts\activate
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
🎥 Demo

📸 Capturas
Home	Detalle	Mapa

🧭 Roadmap
 Búsqueda y mapa

 Integración QR

 Modo offline / PWA

 Panel de administración para curadores

👩‍💻 Autora
Berenice Solohaga
Desarrolladora Full Stack · Rosario, Argentina
🌐 Portfolio | 💼 LinkedIn

🪪 Licencias
Código: MIT

Datos e imágenes: CC-BY 4.0
