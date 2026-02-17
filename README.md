# API Basics 2026

API REST desarrollada con **NestJS** que se conecta a **SQL Server** siguiendo el enfoque **Database First**.

## Descripción

Este proyecto es una API que utiliza la base de datos como fuente de verdad: el esquema y las entidades se derivan de una base de datos SQL Server existente. Se utiliza **Sequelize** con **sequelize-typescript** para el acceso a datos y el mapeo con la base de datos.

## Tecnologías

- **NestJS** – Framework backend
- **SQL Server** – Base de datos
- **Sequelize** + **sequelize-typescript** – ORM y conexión a SQL Server
- **Swagger** – Documentación de la API

## Requisitos

- Node.js (v18 o superior recomendado)
- SQL Server (local o remoto)
- npm o yarn

## Instalación

```bash
npm install
```

## Configuración

Configura la conexión a SQL Server según el entorno (variables de entorno o archivo de configuración del módulo de base de datos). Asegúrate de tener definidos:

- Servidor/host
- Nombre de la base de datos
- Usuario y contraseña (o autenticación integrada)

## Ejecución

```bash
# Desarrollo (con recarga en caliente)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

Por defecto la API corre en **http://localhost:3000**.

## Documentación de la API

La documentación Swagger está disponible en:

**http://localhost:3000/api/docs**

## Estructura básica

- `src/database/` – Módulo y proveedores de conexión a SQL Server
- `src/productos/` – Módulo de productos (ejemplo de recurso)
- `src/main.ts` – Punto de entrada y configuración de Swagger

## Licencia

UNLICENSED
