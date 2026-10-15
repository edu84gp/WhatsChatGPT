# 🤖💬 WhatsChatGPT - Chatbot en Tiempo Real con WebSockets e IA (Ollama)

Aplicación web de chatbot en tiempo real desarrollada como práctica de desarrollo Full Stack (módulo Back-End). Utiliza una arquitectura cliente-servidor con comunicación bidireccional mediante **WebSockets (Socket.io)** e integración con Inteligencia Artificial mediante **Ollama**, contando con una interfaz de usuario inspirada en **WhatsApp Web**.

---

## 🚀 Características Principales

* **Asistente Virtual con IA Integrada:** Respuestas generadas automáticamente por modelos de lenguaje a través del SDK de **Ollama** (`gpt-oss:120b`).
* **Formato Enriquecido con Markdown (`marked.js`):** Las respuestas del bot se parsean y muestran con formato enriquecido (negritas, listas ordenadas/desordenadas y bloques de código monoespaciados).
* **Comunicación Bidireccional en Tiempo Real:** Envío y recepción instantánea de mensajes mediante **Socket.io** sin necesidad de recargar la página.
* **Interfaz Estilo WhatsApp Web:**
  * Cabecera con verde oficial `#008069` y estado de conexión en vivo (*en línea*, *desconectado* o *servidor inactivo*).
  * Fondo texturizado clásico beige/arena (`#efeae2`).
  * Burbujas diferenciadas: verde pastel claro (`#d9fdd3`) con **doble check azul (`✓✓`)** para tus mensajes y blancas (`#ffffff`) con autor destacado para los mensajes del Asistente IA y otros participantes.
  * Botón circular de envío verde (`#00a884`) y barra de entrada de texto limpia.
* **Identificación de Usuario:** Campo personalizable para definir tu nombre o apodo en el chat.
* **Scroll Automático:** Desplazamiento suave al último mensaje recibido o enviado.
* **Diseño Responsivo:** Completamente adaptable tanto a ordenadores de escritorio como a dispositivos móviles.

---

## 🛠️ Tecnologías Utilizadas

### Backend
* **[Node.js](https://nodejs.org/):** Entorno de ejecución para JavaScript del lado del servidor (configurado con ES Modules `"type": "module"`).
* **[Express](https://expressjs.com/):** Framework para servir los archivos estáticos del frontend (`public/`).
* **[Socket.io](https://socket.io/):** Comunicación bidireccional basada en WebSockets y gestión de eventos en tiempo real.
* **[Ollama SDK](https://www.npmjs.com/package/ollama):** Cliente oficial para conectar e interactuar con la API del modelo de lenguaje.
* **[dotenv](https://www.npmjs.com/package/dotenv):** Carga y gestión segura de variables de entorno desde el archivo `.env`.
* **[HTTP Nativo](https://nodejs.org/api/http.html):** Servidor HTTP base para acoplar Express y Socket.io.

### Frontend
* **HTML5:** Estructura semántica de la aplicación (`<header>`, `<main>`, `<footer>`, `<form>`).
* **CSS3:** Variables nativas (`:root`), Flexbox, animaciones (`@keyframes fadeIn`), media queries para diseño responsivo y estilos para Markdown.
* **JavaScript (Vanilla):** Gestión del DOM, eventos de formulario y conexión con Socket.io.
* **[Marked.js](https://marked.js.org/):** Parser ligero cargado por CDN para renderizar el Markdown emitido por el modelo de IA.

---

## 📁 Estructura del Proyecto

```text
WhatsChatGPT/
├── public/
│   ├── index.html           # Interfaz principal del chat
│   └── src/
│       ├── css/
│       │   └── style.css    # Estilos del tema WhatsApp y formato Markdown
│       └── js/
│           └── script.js    # Lógica del cliente, eventos Socket.io y parseo Markdown
├── src/
│   └── js/
│       └── ai.service.js    # Servicio modular para la consulta a la IA (Ollama)
├── .env                     # Variables de entorno (API Key y Puerto) [no subir al repositorio]
├── package.json             # Configuración del proyecto, dependencias y scripts
├── server.js                # Servidor principal (Express + Socket.io + invocación a la IA)
└── README.md                # Documentación del proyecto
```

---

## ⚙️ Instalación y Uso

### 1. Requisitos Previos
* Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior, recomendado v20+).
* Contar con una API Key y acceso al servicio o servidor de **Ollama**.

### 2. Clonar o descargar el repositorio
```bash
git clone https://github.com/edu84gp/WhatsChatGPT.git
cd WhatsChatGPT
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Configurar las Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
OLLAMA_API_KEY=tu_api_key_aqui
PORT=3000
```

### 5. Iniciar el servidor
```bash
npm run start
```
> El servidor se iniciará en: **`http://localhost:3000`**

### 6. Usar el Chatbot
1. Abre tu navegador y accede a `http://localhost:3000`.
2. Escribe tu nombre o apodo en el campo superior derecho.
3. Escribe cualquier mensaje o pregunta en la barra inferior y presiona **Enter** o el botón de enviar.
4. El mensaje aparecerá en tu ventana como emitido por ti y, a continuación, el **Asistente WhatsChatGPT** responderá con formato enriquecido.

---

## 📡 Flujo de Comunicación y Eventos

```text
[Navegador / Cliente]
       │
       ▼ (1) socket.emit("chat:message", { username, text, time, socketId })
[server.js]
       │
       ├─► (2) io.emit("chat:message", data) ──► Se muestra inmediatamente el mensaje del usuario
       │
       ▼ (3) await consultarIA(data.text)
[ai.service.js (Ollama)]
       │
       ▼ (4) Retorna respuesta generada
[server.js]
       │
       ▼ (5) io.emit("chat:message", mensajeIA) ──► El bot responde en el chat
[Navegador / Cliente]
       │
       └─► (6) marked.parse() renderiza la respuesta de la IA en pantalla
```

### Tabla de Eventos de Socket.io

| Evento | Emisor | Receptor | Descripción |
| :--- | :--- | :--- | :--- |
| `connection` | Servidor | Servidor | Se dispara cuando un cliente se conecta. |
| `chat:message` | Cliente | Servidor | Envía el objeto con `{ username, text, time, socketId }`. |
| `chat:message` | Servidor | Todos los Clientes | Retransmite tanto el mensaje del usuario como la respuesta del bot (`mensajeIA`). |
| `chat:system` | Servidor | Cliente | Muestra avisos informativos centrados en la sala. |
| `disconnect` | Servidor | Servidor | Detecta cuando un usuario cierra la pestaña o se desconecta. |

---

## 📄 Licencia

Este proyecto está bajo la Licencia **ISC**. Desarrollado con fines educativos y de aprendizaje Full Stack.
