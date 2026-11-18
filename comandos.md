# Comandos del proyecto

Referencia de los comandos usados en el curso de NestJS y qué hace cada uno.

## 1. Crear el proyecto (Clase 1)

| Comando | Qué hace |
|---|---|
| `npm i -g @nestjs/cli` | Instala la CLI de Nest de forma global para poder usar el comando `nest`. |
| `nest new {nombre_proyecto}` | Crea un proyecto nuevo: estructura `src/`, `package.json`, `tsconfig`, configuración de Jest y el `README.md` estándar. |

## 2. Dependencias

| Comando | Qué hace |
|---|---|
| `npm install` | Instala todas las dependencias de `package.json` en `node_modules`. |
| `npm i @nestjs/config` | Variables de entorno desde `.env` (Clase 5a). |
| `npm i @nestjs/typeorm typeorm pg` | ORM TypeORM y el driver de PostgreSQL (Clases 5d y 5e). |
| `npm i class-validator class-transformer` | Validación y transformación de los DTOs (Clase 7c). |
| `npm i @nestjs/mapped-types` | Utilidades como `PartialType` para los DTOs de actualización (Clase 7d). |

## 3. Docker y PostgreSQL

### 3.1 Crear `docker-compose.yml`

Crea el archivo `docker-compose.yml`, que define el servicio `postgres` (puerto 5432) y `pgadmin` (puerto 5050), y colócale este contenido. Edita los valores con los de tu base de datos:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mi_base_datos
      POSTGRES_USER: mi_usuario
      POSTGRES_PASSWORD: mi_password
      PGDATA: /var/lib/postgresql/17/docker
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Optional: pgAdmin for database management
  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@ejemplo.com
      PGADMIN_DEFAULT_PASSWORD: admin_password
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      - postgres

volumes:
  postgres_data:
  pgadmin_data:
```

### 3.2 Levantar los contenedores

| Comando | Qué hace |
|---|---|
| `docker compose -p {nombre} up -d` | Levanta PostgreSQL y pgAdmin en segundo plano (`-d`, *detached*) usando `{nombre}` como nombre del proyecto (`-p`, *project name*). Ese nombre es el prefijo de los contenedores, la red y los volúmenes que se crean, por ejemplo `{nombre}-postgres-1` y `{nombre}_postgres_data`. Sin `-p`, Docker usa el nombre de la carpeta. |

> Si levantaste con `-p {nombre}`, usa el **mismo** `-p` en los demás comandos de ese proyecto (`ps`, `logs`, `down`); si no, Docker no lo encuentra.

### 3.3 Abrir pgAdmin y registrar el servidor

pgAdmin es la interfaz web para ver la base de datos. Con los contenedores levantados:

1. Abrir desde Docker Desktop: clic en `5050:80`.
2. En el panel izquierdo, clic derecho en **Servers** → **Register** → **Server…** (o el botón *Add New Server* de la pantalla de inicio).
3. Pestaña **General**:
   - **Name**: el nombre que quieras, por ejemplo `mi_api_nest`. Es solo una etiqueta dentro de pgAdmin.
4. Pestaña **Connection** (valores de `docker-compose.yml`; en *Password* coloca la contraseña ya configurada en Postgres):

   | Campo | Valor | Por qué |
   |---|---|---|
   | Host name/address | `postgres` | Es el nombre del servicio en `docker-compose.yml`. pgAdmin corre **dentro de Docker**, y ahí `localhost` sería su propio contenedor, no la base de datos. |
   | Port | `5432` | Puerto de PostgreSQL dentro de la red de Docker. |
   | Maintenance database | `mi_base_datos` | Valor de `POSTGRES_DB`. |
   | Username | `mi_usuario` | Valor de `POSTGRES_USER`. |
   | Password | `mi_password` | Valor de `POSTGRES_PASSWORD`. Activa **Save password** para no escribirla cada vez. |

5. Clic en **Save**. Si conecta, el servidor aparece en el árbol: **Servers → mi_api_nest → Databases → mi_base_datos → Schemas → public → Tables**. Ahí se ven las tablas que crea TypeORM.

## 4. Generar código con la CLI (`nest generate`, alias `nest g`)

| Comando | Qué hace |
|---|---|
| `nest g module users` | Crea `users.module.ts` y lo registra en `AppModule`. |
| `nest g controller users` | Crea el controlador (rutas HTTP) del módulo. |
| `nest g service users` | Crea el servicio (lógica de negocio) del módulo. |

El más importante:

| Comando | Qué hace |
|---|---|
| `nest g res post` | **CRUD automático** (Clase 8): módulo, controlador, servicio, entidad y DTOs de create/update. Pregunta el tipo de transporte; para una API REST se elige `REST API` y luego `Yes` a generar los puntos de entrada del CRUD. |
| `nest g res categories` | Igual que el anterior, para `categories` (Clase 8, relación ManyToMany). |

## 5. Ejecutar la aplicación

| Comando | Qué hace |
|---|---|
| `npm run start:dev` | Modo desarrollo: reinicia la app al guardar cambios (`--watch`). |

