<div align="center">

<img src="./logo/logo.png" alt="Car Rental logo" width="220" />

# 🚗 RentaCars API

**API REST para gestionar el alquiler de vehículos**

![NestJS](https://img.shields.io/badge/NestJS-12-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## 📖 Descripción

API desarrollada con **NestJS**, **TypeORM** y **PostgreSQL** para administrar una empresa de renta de carros:

- 🚙 **Cars** – catálogo de vehículos (marca, modelo, placa, año, precio por día y disponibilidad).
- 👤 **Users** – usuarios con su perfil (nombre, teléfono y licencia de conducción).
- 📅 **Rentals** – alquileres que relacionan un usuario con un carro (fecha de inicio y fin, notas y estado activo). Valida que el usuario y el carro existan, que el carro esté disponible y que la fecha de fin sea posterior a la de inicio.

Incluye operaciones **CRUD** por recurso y validación de datos con DTOs.

## ✅ Requisitos

| Herramienta | Versión |
|-------------|---------|
| [Node.js](https://nodejs.org/) | 20.19 o superior |
| [npm](https://www.npmjs.com/) | Incluido con Node.js |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Para levantar PostgreSQL |

## 🗄️ Configuración de la base de datos

La base de datos corre en Docker, no necesitas instalar PostgreSQL.

**1. Crea el archivo `.env`** a partir del ejemplo:

```bash
cp .env.example .env
```

**2. Completa los valores** (coinciden con `docker-compose.yml`):

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_DB=car_rental_db
POSTGRES_USER=car_user
POSTGRES_PASSWORD=car_password
```

**3. Levanta PostgreSQL y pgAdmin:**

```bash
docker compose up -d
```

| Servicio | URL / Puerto |
|----------|--------------|
| 🐘 PostgreSQL | `localhost:5433` |
| 🛠️ pgAdmin (opcional) | http://localhost:5050 — `admin@carsrentals.com` / `admin_password` |

> Las tablas se crean solas al iniciar la API (`synchronize: true`), no hay que ejecutar migraciones.

## 🚀 Ejecutar el proyecto

```bash
# 1. Clonar el repositorio
git clone https://github.com/ingmao021/RentaCars.git
cd RentaCars

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm run start:dev
```

La API queda disponible en **http://localhost:3000** 🎉

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Desarrollo con recarga automática |
| `npm run build` y `npm run start:prod` | Compilar y ejecutar en producción |
| `npm test` | Pruebas unitarias |

---

## 🎬 Video presentaciones de cada integrante

<!-- Reemplaza cada PEGAR_LINK_DRIVE_AQUI por el enlace del video en Google Drive -->

<div align="center">

<table>
  <tr>
    <td align="center" width="50%">
      <h3>🎥</h3>
      <b>Anderson Mauricio<br>Ordoñez Zuñiga</b><br><br>
      <a href="https://drive.google.com/file/d/1oGchn2VRZGlv2wJcJu3mIGLTTqgQNbi4/view?usp=sharing"><img src="https://img.shields.io/badge/Google%20Drive-Ver%20video-4285F4?style=for-the-badge&logo=googledrive&logoColor=white" alt="Ver video en Google Drive" /></a>
    </td>
    <td align="center" width="50%">
      <h3>🎥</h3>
      <b>Juan Camilo<br>Bastidas</b><br><br>
      <a href="PEGAR_LINK_DRIVE_AQUI"><img src="https://img.shields.io/badge/Google%20Drive-Ver%20video-4285F4?style=for-the-badge&logo=googledrive&logoColor=white" alt="Ver video en Google Drive" /></a>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <h3>🎥</h3>
      <b>Benjamin Andres<br>Urbano Zuñiga</b><br><br>
      <a href="https://drive.google.com/file/d/1hi_Hg9_n_u6mO5e6Rj5pPwQG-UJc5VAo/view?usp=sharing&t=38.743"><img src="https://img.shields.io/badge/Google%20Drive-Ver%20video-4285F4?style=for-the-badge&logo=googledrive&logoColor=white" alt="Ver video en Google Drive" /></a>
    </td>
    <td align="center" width="50%">
      <h3>🎥</h3>
      <b>Juan Sebastian<br>Ibarra</b><br><br>
      <a href="PEGAR_LINK_DRIVE_AQUI"><img src="https://img.shields.io/badge/Google%20Drive-Ver%20video-4285F4?style=for-the-badge&logo=googledrive&logoColor=white" alt="Ver video en Google Drive" /></a>
    </td>
  </tr>
</table>

</div>
