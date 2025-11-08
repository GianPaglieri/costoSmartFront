# costoSmartFront

Frontend (React 18 + MUI 5) para la gestión de costos, recetas y ventas de CostoSmart.

## Requisitos

- Node.js 18.x o superior
- npm 8.x o superior

## Puesta en marcha local

1. Copiá `.env.example` a `.env.local`.
2. Ajustá `REACT_APP_API_URL` si necesitás apuntar a otro backend (por defecto usa `http://149.50.131.253/api`).
3. Instalá dependencias con `npm install`.
4. Levantá el entorno con `npm start` (puerto configurable). CRA proxyea automáticamente las rutas `/api/*` al backend configurado en `package.json`.

## Scripts disponibles

```bash
npm start      # Desarrollo con react-scripts
npm run build  # Build optimizado en /build
npm test       # Jest + Testing Library (watch mode)
```

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `REACT_APP_API_URL` | Base URL del backend en producción (por defecto `http://149.50.131.253/api`). |

## Docker

El `Dockerfile` usa un build multi-stage:

1. `node:18-alpine` para instalar dependencias vía `npm ci` y generar `/build`.
2. `nginx:alpine` para servir el build en el puerto 80.

Para construir y correr el contenedor:

```bash
docker build -t costosmart-front .
docker run -p 8080:80 costosmart-front
```

## Testing

Hay pruebas unitarias iniciales para `src/utils/auth.js`. Si se agrega lógica crítica, extender la cobertura con Jest/Testing Library o E2E.

## Buenas prácticas adoptadas

- Axios centralizado con fallback a proxy local (gracias al `proxy` de CRA) para evitar errores CORS en `npm start`.
- Hooks reutilizables (`src/hooks/`) para formularios, diálogos y búsqueda global.
- Utilidades de formato y medios en `src/utils/`.
- Assets necesarios únicamente en `public/` (se quitó `src/uploads/` para evitar peso extra en el repo).

## Checklist antes de producción

- Variables `.env` correctas y sin `console.log` residuales.
- Ejecutar `npm run build` y, si aplica, `docker build`.
- Verificar Lighthouse/SEO (metadatos actualizados en `public/index.html` y `public/manifest.json`).
