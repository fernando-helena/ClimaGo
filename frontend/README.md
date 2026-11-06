# ClimaGo frontend

Aplicación Ionic + Angular para consumir la API Laravel de ClimaGo.

## Funciones

- Registro e inicio de sesión con token de Laravel Sanctum.
- Consulta de clima por ciudad y país.
- Agregar ciudades favoritas desde el resultado del clima, listar y eliminar.
- Historial de búsquedas y datos de la cuenta.
- Rutas protegidas e interceptor que envía `Authorization: Bearer <token>` y `Accept: application/json` a la API.

## Configuración y uso

1. Actualiza `src/environments/environment.ts` con la URL de tu backend Laravel. Por defecto usa `http://127.0.0.1:8000/api`.
2. Instala dependencias con `npm install`.
3. Ejecuta `npm start` y abre la dirección que muestra Angular.

Para probar desde un teléfono, reemplaza `127.0.0.1` por la IP local de la computadora donde corre Laravel y verifica que CORS permita el origen de la aplicación.

## Endpoints utilizados

Públicos: `POST /register`, `POST /login`.

Protegidos: `GET /user`, `GET /weather?city=`, `GET/POST/DELETE /favorites`, `GET /history`.
