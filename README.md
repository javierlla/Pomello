# Pomello
## Gestor de Tareas con Integración Pomodoro

**Pomello** es una aplicación full-stack de gestión de tareas que combina la estructura organizativa de **Trello** con el ritmo productivo de la **técnica Pomodoro**. Implementa un componente desplegable que mejora la interacción del usuario permitiendo la selección dinámica de opciones relacionadas con las tareas.

## Contribuidores

- [Igor Aparicio](https://github.com/Igoruve)
- [Daniel Arroyo](https://github.com/darroyo083)
- [Dalila Cabrera](https://github.com/crdalila)
- [Javier Llarena](https://github.com/javierlla)
- [Indira Sierra](https://github.com/IndiraSierra)

---

## Funcionalidades

### Funcionalidad Principal

- **Tableros de Tareas:** Crear proyectos, listas y tareas. Funcionalidad drag-and-drop para una gestión fluida del flujo de trabajo.
- **Temporizador Pomodoro:** Temporizador totalmente integrado con intervalos personalizables de concentración y descanso. Automatiza el ciclo de inicio-parada para sesiones de trabajo profundo.
- **Seguimiento de Estadísticas:** La lógica del backend almacena datos de uso y sesiones del temporizador para análisis y retroalimentación sobre productividad.
- **Interfaz Responsiva:** Construida con React y TailwindCSS.

---

## 🚀 Tecnologías Utilizadas

| Capa          | Tecnología          |
|---------------|---------------------|
| Frontend      | React + TailwindCSS |
| Backend       | Node.js + Express   |
| Base de Datos | MongoDB + Mongoose  |
| Auth & Tokens | JWT                 |
| Herramientas  | Vite                |

---

## Estructura del Proyecto

```bash
Pomello/
├── client/
│   ├── src/
│   │   ├── components/           # Componentes pequeños
│   │   ├── context/              # Contexto de autenticación
│   │   ├── data/                 # Datos de ejemplo
│   │   ├── pages/                # Componentes principales
│   │   ├── styles/               # Estilos personalizados
│   │   ├── utils/
├── server/
│   ├── docs/                     # Documentación
│   ├── src/
│   │   ├── config/               # Configuración de Mongoose
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/                # Errores, tokens y bcrypt
│   │   ├── index.js
│   ├── package.json              # Dependencias del servidor

Instalación

# Clonar el repositorio
git clone https://github.com/javierlla/Pomello.git
cd Pomello

Instalar dependencias del cliente

cd client
npm install

Instalar dependencias del servidor

cd ../server
npm install

Uso
Iniciar el servidor (backend)

cd server
docker compose up

Iniciar el cliente (frontend)

cd client
npm run dev
