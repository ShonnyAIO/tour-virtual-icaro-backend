# Backend Tour Virtual UCV

## Descripción
Backend para el sistema de recorridos virtuales de la Universidad Central de Venezuela (UCV). Este proyecto proporciona una API RESTful para gestionar escenas, orígenes y configuraciones para tours virtuales interactivos.

## Características

- Gestión de escenas con soporte para panorámicas 360°
- Sistema de orígenes para organizar tours por dominio
- Hotspots interactivos para navegación entre escenas
- Autenticación y autorización de usuarios
- API RESTful con documentación detallada
- Base de datos PostgreSQL con Sequelize ORM
- Migraciones y seeds para la base de datos

## Requisitos Previos

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd backend-tour-virtual
   ```

2. Instalar dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Configurar las variables de entorno:
   ```bash
   cp .env.example .env
   # Editar el archivo .env con tus credenciales
   ```

4. Configuración de la base de datos:
   - Crear una base de datos PostgreSQL
   - Configurar las credenciales en el archivo `.env`

5. Ejecutar migraciones:
   ```bash
   npx sequelize-cli db:migrate
   ```

6. (Opcional) Ejecutar seeds para datos iniciales:
   ```bash
   npx sequelize-cli db:seed:all
   ```

## Estructura del Proyecto

```
src/
├── config/               # Configuraciones
│   └── database.js       # Configuración de la base de datos
├── controllers/          # Controladores de la API
│   ├── sceneController.js
│   └── ...
├── middlewares/          # Middlewares de Express
├── models/               # Modelos de Sequelize
│   ├── Scene.js
│   ├── Origen.js
│   └── ...
├── migrations/           # Migraciones de la base de datos
├── routes/               # Rutas de la API
│   ├── api.js
│   └── ...
└── utils/                # Utilidades
```

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
NODE_ENV=development
PORT=3000

# Base de datos
DB_NAME=nombre_bd
DB_USER=usuario
DB_PASSWORD=contraseña
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRES_IN=30d

# Otros
API_PREFIX=/api
```

## Uso

### Iniciar el servidor en desarrollo:
```bash
npm run dev
# o
yarn dev
```

### Iniciar en producción:
```bash
npm start
# o
yarn start
```

### Ejecutar tests:
```bash
npm test
# o
yarn test
```

## API Endpoints

### Escenas
- `GET /api/scenes` - Obtener todas las escenas
- `GET /api/scenes/:id` - Obtener una escena por ID
- `POST /api/scenes` - Crear una nueva escena
- `PUT /api/scenes/:id` - Actualizar una escena existente
- `DELETE /api/scenes/:id` - Eliminar una escena

### Orígenes
- `GET /api/origenes` - Obtener todos los orígenes
- `POST /api/origenes` - Crear un nuevo origen
- `GET /api/origenes/dominio/:dominio` - Obtener escenas por dominio

## Migraciones

### Crear una nueva migración:
```bash
npx sequelize-cli migration:generate --name nombre-de-la-migracion
```

### Ejecutar migraciones:
```bash
npx sequelize-cli db:migrate
```

### Revertir la última migración:
```bash
npx sequelize-cli db:migrate:undo
```

## Modelos

### Scene
- `id`: Entero autoincremental (PK)
- `id_scene`: String - Identificador único de la escena
- `title`: String - Título de la escena
- `image`: String - Ruta o URL de la imagen panorámica
- `pitch`: Float - Ángulo de inclinación inicial
- `yaw`: Float - Ángulo de rotación inicial
- `hfov`: Integer - Campo de visión horizontal
- `hostSpots`: JSON - Hotspots de navegación
- `origenId`: Integer - Referencia al origen (FK)
- `dominio`: String - Caché del dominio para búsquedas rápidas

### Origen
- `id`: Entero autoincremental (PK)
- `nombre`: String - Nombre descriptivo del origen
- `dominio`: String - Dominio asociado (único)
- `activo`: Boolean - Estado del origen
- `configuracion`: JSON - Configuración adicional

## Contribución

1. Hacer fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Hacer commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Hacer push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

- [Tu Nombre] - [tu@email.com]
- [Enlace al Proyecto](https://github.com/tu-usuario/backend-tour-virtual)
