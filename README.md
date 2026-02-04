# La Mosca - Juego de Cartas Multijugador Online

**v0.0 - Beta**

La Mosca es un juego de cartas argentino multijugador online en tiempo real. Este proyecto se encuentra en fase beta (v0.0), por lo que pueden existir bugs, funcionalidades incompletas o cambios importantes en el futuro.

## Tecnologias

El proyecto tiene una estructura monorepo con dos módulos principales:

### Frontend
- **React 19** con JSX
- **Vite** como bundler y servidor de desarrollo
- **Socket.io Client** para comunicación en tiempo real
- **CSS** vanilla para los estilos

### Backend
- **Node.js** con **Express 5**
- **TypeScript**
- **Socket.io** para WebSockets
- **MongoDB** con **Mongoose** como base de datos
- **Vitest** para testing

## Estructura del proyecto

```
mosca/
├── frontend/    # Aplicación React (UI del juego)
├── backend/     # Servidor Node.js (lógica del juego y WebSockets)
└── README.md
```

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/EmilianoBecerra/La-Mosca

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

## Ejecución en desarrollo

```bash
# Backend (desde /backend)
npm run dev

# Frontend (desde /frontend)
npm run dev
```

## Open Source

Este proyecto es open source y está abierto a la comunidad. Si te interesa participar, ya sea corrigiendo bugs, sumando funcionalidades o mejorando el código existente o el diseño, sos bienvenido desde ahora.

Formas de contribuir:
- Reportar bugs o problemas abriendo un issue.
- Proponer mejoras o nuevas funcionalidades.
- Enviar pull requests con correcciones o features.
- Mejorar la documentación.

No hace falta ser experto, cualquier aporte suma :).
