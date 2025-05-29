# 🧠 Pomello  
**Gestor de Tareas con Técnica Pomodoro Integrada**

**Pomello** es una aplicación full-stack de gestión de tareas que combina la estructura organizativa de **Trello** con el ritmo productivo de la **técnica Pomodoro**. Incorpora un componente desplegable que mejora la interacción del usuario al permitir la selección dinámica de opciones relacionadas con las tareas.

---

## 👨‍💻 Contribuidores

- **Igor Aparicio**  
- **Daniel Arroyo**  
- **Dalila Cabrera**  
- **Javier Llarena**  
- **Indira Sierra**

---

### Funciones Principales

- **Tableros de Tareas**: Crea proyectos, listas y tareas. Funcionalidad de *drag-and-drop* para una gestión fluida del flujo de trabajo.
- **Temporizador Pomodoro**: Temporizador totalmente integrado con intervalos personalizables de enfoque y descanso. Automatiza los ciclos de trabajo profundo.
- **Seguimiento de Estadísticas**: La lógica del backend almacena datos de uso y sesiones del temporizador para análisis y retroalimentación de productividad.
- **Interfaz Responsiva**: Construida con **React** y **TailwindCSS**.

---

## 🚀 Tecnologías Utilizadas

| Capa           | Tecnología                 |
|----------------|----------------------------|
| Frontend       | React + TailwindCSS        |
| Backend        | Node.js + Express          |
| Base de Datos  | MongoDB + Mongoose         |
| Autenticación  | JWT                        |
| Herramientas   | Vite                       |

---

## 🗂 Estructura del Proyecto

Pomello/
├── client/
│ ├── src/
│ │ ├── components/ # Componentes pequeños
│ │ ├── context/ # Contexto de autenticación
│ │ ├── data/ # Datos de ejemplo
│ │ ├── pages/ # Componentes principales
│ │ ├── styles/ # Estilos personalizados
│ │ ├── utils/ # Utilidades
├── server/
│ ├── docs/ # Documentación
│ ├── src/
│ │ ├── config/ # Configuración de Mongoose
│ │ ├── controllers/ # Controladores
│ │ ├── middlewares/ # Middlewares
│ │ ├── models/ # Modelos de MongoDB
│ │ ├── routes/ # Rutas
│ │ ├── utils/ # Errores, token y bcrypt
│ │ ├── index.js # Punto de entrada
│ ├── package.json # Dependencias del backend


---

## ⚙️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/javierlla/Pomello.git
cd Pomello

Instalar dependencias del cliente:

cd client
npm install

Instalar dependencias del servidor:

cd ../server
npm install

▶️ Uso
Iniciar el servidor (backend):

cd server
docker compose up

Iniciar la aplicación cliente (frontend):

cd client
npm run dev
### Start the client (frontend):
```bash
cd client
npm run dev
```
