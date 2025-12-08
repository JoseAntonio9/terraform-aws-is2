# TaskFlow - Frontend con React

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)

Frontend robusto y moderno para la aplicación **TaskFlow**, un gestor de tareas personal. Esta interfaz de usuario ha sido desarrollada siguiendo rigurosamente la metodología de **Programación Extrema (XP)**, enfocándose en la entrega de valor, la calidad del código y la colaboración continua.

---

## Tabla de Contenidos

1.  [**Visión General del Proyecto**](#-visión-general-del-proyecto)
2.  [**Características Principales**](#-características-principales)
3.  [**Pila Tecnológica**](#-pila-tecnológica)
4.  [**Instalación y Ejecución Local**](#-instalación-y-ejecución-local)
5.  [**Ejecución de Pruebas**](#-ejecución-de-pruebas)
6.  [**Decisiones de Arquitectura y Diseño**](#-decisiones-de-arquitectura-y-diseño)
7.  [**metodologia-xp-en-accion Metodología XP en Acción**](#-metodología-xp-en-acción)
8.  [**Despliegue con Docker**](#-despliegue-con-docker)
9.  [**Equipo de Desarrollo**](#-equipo-de-desarrollo)

---

## Visión General del Proyecto

TaskFlow ofrece una interfaz de usuario limpia, rápida e intuitiva para que los usuarios gestionen sus tareas diarias. El sistema cuenta con autenticación segura basada en JWT y permite a los usuarios realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre sus tareas de manera eficiente.

---

## Características Principales

*   **Autenticación Segura:** Flujo completo de registro e inicio de sesión con validaciones y manejo de tokens JWT.
*   **Dashboard Interactivo:** Vista principal con estadísticas en tiempo real sobre el progreso de las tareas.
*   **Gestión Completa de Tareas:**
    *   Creación de tareas a través de un formulario modal intuitivo.
    *   Edición de título, descripción y prioridad.
    *   Marcado de tareas como completadas con un solo clic.
    *   Eliminación de tareas con diálogo de confirmación.
*   **Estado Global Persistente:** La sesión del usuario se mantiene incluso después de recargar la página.
*   **Diseño Responsivo:** Experiencia de usuario optimizada para dispositivos móviles, tablets y de escritorio.
*   **Retroalimentación Visual:** Indicadores de carga y notificaciones (toasts) para una mejor experiencia de usuario.

---

## Pila Tecnológica

*   **Framework Principal:** React 18.2.0
*   **Enrutamiento:** React Router v6
*   **Cliente HTTP:** Axios (con interceptores para el manejo de autenticación)
*   **Gestión de Estado Global:** React Context API
*   **Estilos:** CSS3 puro con un enfoque BEM-like para la organización.
*   **Pruebas Unitarias:** Jest y React Testing Library
*   **Pruebas End-to-End:** Cypress
*   **Notificaciones:** React Hot Toast

---

## Instalación y Ejecución Local

Sigue estos pasos para levantar el proyecto en tu máquina local.

### **Prerrequisitos**

*   Node.js v16 o superior.
*   npm v8 o superior.
*   Tener el [backend de TaskFlow](<URL-DEL-REPO-BACKEND>) ejecutándose en `http://localhost:5000`.

### **Pasos de Instalación**

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/taskflow-frontend.git
    cd taskflow-frontend
    ```

2.  **Instalar dependencias:**
    Este comando instalará todas las librerías necesarias definidas en `package.json`.
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y añade la URL del backend.
    ```bash
    # .env.local
    REACT_APP_API_URL=http://localhost:5000/api
    ```

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm start
    ```
    La aplicación se abrirá automáticamente en [**http://localhost:3000**](http://localhost:3000).

---

## Ejecución de Pruebas

El proyecto cuenta con una suite de pruebas robusta para garantizar la calidad y estabilidad del código.

1.  **Ejecutar Pruebas Unitarias:**
    Lanza el corredor de pruebas de Jest en modo interactivo.
    ```bash
    npm test
    ```

2.  **Ejecutar Pruebas de Integración (End-to-End):**
    Abre la interfaz de Cypress para ejecutar las pruebas de flujo de usuario completas. **Asegúrate de tener el frontend y el backend corriendo antes de ejecutar este comando.**
    ```bash
    npm run cypress:open
    ```

---

## Decisiones de Arquitectura y Diseño

Durante el desarrollo se tomaron decisiones clave para asegurar un código mantenible, escalable y de alta calidad.

### 1. Gestión de Estado: `useState` vs Context API

*   **Estado Local (`useState`):** Se utilizó para manejar el estado de componentes individuales que no necesitan ser compartidos, como los datos de un formulario (`TaskForm`) o el estado de carga (`Dashboard`).

*   **Estado Global (Context API):** Para el estado de autenticación (token y datos del usuario), se optó por **Context API**. La razón principal fue evitar el "prop drilling" (pasar props a través de múltiples niveles de componentes). Para una aplicación de esta escala, Context API ofrece una solución nativa, ligera y suficiente sin añadir la complejidad de librerías externas como Redux o Zustand.

### 2. Capa de Servicios (API)

En lugar de hacer llamadas `fetch` o `axios` directamente en los componentes, se creó una capa de servicio centralizada en `src/services/api.js`. Esta decisión ofrece varias ventajas:
*   **Centralización:** Toda la lógica de comunicación con el backend está en un solo lugar.
*   **Reutilización:** Las funciones (`getTasks`, `login`, etc.) pueden ser importadas por cualquier componente.
*   **Manejo de Autenticación:** Se configuraron **interceptores de Axios** para inyectar automáticamente el token JWT en todas las peticiones y para manejar globalmente los errores de autenticación (ej: desloguear al usuario si el token expira).

### 3. Estructura de Componentes

Se siguió una filosofía de componentes atómicos y reutilizables:
*   **Componentes Contenedores (Inteligentes):** Como `Dashboard.js`, que se encargan de la lógica, el estado y las llamadas a la API.
*   **Componentes de Presentación (Tontos):** Como `TaskList.js` o `TaskItem.js`, que solo reciben datos (props) y funciones, y se encargan exclusivamente de renderizar la UI. Esto mejora la predictibilidad y facilita las pruebas.

---

##  metodología-xp-en-accion Metodología XP en Acción

Este proyecto es el resultado de la aplicación de las prácticas de Programación Extrema:

*   **El Juego de la Planificación:** El desarrollo se guió por historias de usuario claras para definir el alcance de cada iteración.
*   **Entregas Pequeñas (Iteraciones):** El proyecto se dividió en dos entregas funcionales, permitiendo la retroalimentación y la mejora continua.
*   **Pruebas Continuas:** Se implementó una suite de pruebas unitarias (Jest) y de integración (Cypress) para asegurar que cada nueva funcionalidad no rompiera el código existente.
*   **Programación en Parejas (Pair Programming):** Se simuló a través de un estricto proceso de **revisión de código mediante Pull Requests**. Ningún código se integró a la rama principal sin la aprobación de al menos otro miembro del equipo.
*   **Diseño Simple:** Se eligió la solución más sencilla y efectiva para cada problema (ej. Context API en lugar de Redux), evitando la sobreingeniería.
*   **Integración Continua:** Se configuraron workflows de **GitHub Actions** para ejecutar las pruebas automáticamente en cada Pull Request, garantizando que la rama `main` siempre se mantenga estable.

---

## Despliegue con Docker

Para facilitar el despliegue y asegurar un entorno de ejecución consistente, el proyecto ha sido completamente "dockerizado". Esto permite levantar toda la aplicación (frontend y backend) con un solo comando.

### **Prerrequisitos**

*   Docker y Docker Compose instalados en tu sistema.
*   Haber clonado tanto el repositorio del frontend como el del backend en la misma carpeta contenedora. La estructura esperada es:
    ```
    proyecto-raiz/
    ├── taskflow-frontend/  <-- Te encuentras aquí
    └── taskflow-backend/
    ```

### **Pasos para la Ejecución**

1.  **Navegar a la raíz del proyecto frontend:**
    Asegúrate de estar en el directorio `taskflow-frontend` donde se encuentra el archivo `docker-compose.yml`.

2.  **Construir y levantar los contenedores:**
    Este comando construirá las imágenes para el frontend y el backend (si no existen) y luego iniciará los contenedores en segundo plano (`-d`).
    ```bash
    docker-compose up --build -d
    ```

3.  **Acceder a la aplicación:**
    Una vez que los contenedores estén en funcionamiento, la aplicación estará disponible en tu navegador en la siguiente dirección:
    *   **Frontend:** [**http://localhost:8080**](http://localhost:8080)

4.  **Detener los contenedores:**
    Para detener la aplicación, ejecuta el siguiente comando desde el mismo directorio:
    ```bash
    docker-compose down
    ```

### **Imágenes en GitHub Container Registry (GHCR)**

Como parte de nuestro flujo de Integración Continua, las imágenes de Docker para este proyecto se construyen y publican automáticamente en el [GitHub Container Registry].

-----
## Equipo de Desarrollo

*   José Antonio García Hernández
*   José David Aguilar Uribe
*   José Manuel Evangelista Tiburcio
*   Yair Uriel Correa Trejo

---

