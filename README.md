# 🚗 API REST de Renta de Carros

API desarrollada con **NestJS** que gestiona el proceso de alquiler de vehículos. Permite administrar el catálogo de carros, registrar clientes y controlar las reservas y rentas, incluyendo la consulta de disponibilidad por fechas, el cálculo del costo según los días de alquiler y el seguimiento del estado de cada renta (activa, finalizada o cancelada).

## Características

- Gestión del catálogo de vehículos
- Registro y administración de clientes
- Creación y control de rentas
- Consulta de disponibilidad por fechas
- Cálculo automático del costo del alquiler
- Seguimiento del estado de cada renta: `activa`, `finalizada`, `cancelada`

## Arquitectura

La API sigue una arquitectura modular por recursos:

| Módulo      | Descripción                          |
|-------------|--------------------------------------|
| `cars`      | Gestión de vehículos                 |
| `customers` | Gestión de clientes                  |
| `rentals`   | Gestión de reservas y rentas         |

- Validación de datos mediante **DTOs**
- Endpoints **CRUD** bajo el estándar REST
- Respuestas en formato **JSON**
- Uso adecuado de los **códigos de estado HTTP**

## Tecnologías

- [NestJS](https://nestjs.com/)
- TypeScript
- Node.js
