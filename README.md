🚀 1) Backend — Strapi
📍 Entrar a la carpeta del backend
cd mate-unico-backend

1️⃣ Instalar dependencias
npm install

2️⃣ Crear archivo .env

En mate-unico-backend/ crear un archivo llamado .env con este contenido: EN DISCORD (INFORMACION MUY SENSIBLE , LUCA XD LOL)

📌 Nota: Si el equipo ya tiene estos valores definidos (por ejemplo, el líder del repo), usarlos tal cual para evitar problemas de login/tokens.

3️⃣ Levantar Strapi
npm run develop

✅ URLs del backend

Admin Strapi: http://localhost:1337/admin

API: http://localhost:1337/api

🖥️ 2) Frontend — Next.js
📍 Entrar a la carpeta del frontend
cd mate-unico-frontend

1️⃣ Instalar dependencias
npm install

2️⃣ Crear archivo .env.local

En mate-unico-frontend/ crear un archivo llamado .env.local con este contenido:

NEXT_PUBLIC_API_URL=http://localhost:1337/api

3️⃣ Levantar el frontend
npm run dev

✅ URL del frontend

Web: http://localhost:3000

🔁 Orden correcto para que funcione todo

Levantar Backend (Strapi):

cd mate-unico-backend
npm install
npm run develop


Levantar Frontend (Next.js):

cd mate-unico-frontend
npm install
npm run dev


Abrir:

http://localhost:3000