// SELECCIÓN DE ELEMENTOS DEL DOM
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const usernameInput = document.getElementById('username-input');
const chatMessages = document.getElementById('chat-messages');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

// CONEXIÓN CON SOCKET.IO
const SERVER_URL = (window.location.port === '3000' || window.location.port === '') 
  ? undefined 
  : 'http://localhost:3000';

const socket = io(SERVER_URL);

// Configuración de marked para que respete saltos de línea
if (typeof marked !== 'undefined') {
  marked.setOptions({
    breaks: true,
    gfm: true
  });
}

// GESTIÓN DE EVENTOS DE CONEXIÓN
// Conexión al servidor
socket.on('connect', () => {
  statusDot.classList.remove('disconnected');
  statusDot.classList.add('connected');
  statusText.textContent = 'en línea';

  agregarMensajeSistema('🟢 Te has conectado al chat');
});

// Se pierde la conexión
socket.on('disconnect', () => {
  statusDot.classList.remove('connected');
  statusDot.classList.add('disconnected');
  statusText.textContent = 'desconectado';

  agregarMensajeSistema('🔴 Se ha perdido la conexión con el servidor');
});

// Error de conexión
socket.on('connect_error', () => {
  statusDot.classList.remove('connected');
  statusDot.classList.add('disconnected');
  statusText.textContent = 'servidor inactivo';
});

// ENVÍO DE MENSAJES AL SERVIDOR
chatForm.addEventListener('submit', (event) => {
  event.preventDefault(); 

  const texto = messageInput.value.trim();
  const usuario = usernameInput.value.trim() || 'Anónimo';

  if (!texto) return;

  const nuevoMensaje = {
    username: usuario,
    text: texto,
    time: obtenerHoraActual(),
    socketId: socket.id
  };

  socket.emit('chat:message', nuevoMensaje);
  messageInput.value = '';
  messageInput.focus();
});

// RECEPCIÓN DE MENSAJES
socket.on('chat:message', (data) => {
  const mensajeFormateado = typeof data === 'string' 
    ? { text: data, username: 'Otro usuario', time: obtenerHoraActual() }
    : data;

  mostrarMensajeEnPantalla(mensajeFormateado);
});

socket.on('chat:system', (texto) => {
  agregarMensajeSistema(texto);
});

// FUNCIONES AUXILIARES PARA EL DOM
function mostrarMensajeEnPantalla(data) {
  console.log("DATA ", data)
  const esMio = Boolean(data.socketId && data.socketId === socket.id);
  const filaMensaje = document.createElement('div');
  filaMensaje.classList.add('message-row');
  filaMensaje.classList.add(esMio ? 'my-message' : 'other-message');
  const burbuja = document.createElement('div');
  burbuja.classList.add('message-bubble');
 if (!esMio) {
    const autorTag = document.createElement('span');
    autorTag.classList.add('author-tag');
    autorTag.textContent = data.username || 'Contacto';
    burbuja.appendChild(autorTag);
  }
  const textoDiv = document.createElement('div');
  textoDiv.classList.add('message-text');

  if (data.socketId === 'bot' && typeof marked !== 'undefined') {
    textoDiv.innerHTML = marked.parse(data.text);
  } else {
    textoDiv.textContent = data.text;
  }

  burbuja.appendChild(textoDiv);

  // Datos
  const meta = document.createElement('div');
  meta.classList.add('message-meta');

  const horaSpan = document.createElement('span');
  horaSpan.classList.add('time');
  horaSpan.textContent = data.time || obtenerHoraActual();
  meta.appendChild(horaSpan);

  if (esMio) {
    const checkSpan = document.createElement('span');
    checkSpan.classList.add('wa-checks');
    checkSpan.title = 'Leído';
    checkSpan.textContent = ' ✓✓';
    meta.appendChild(checkSpan);
  }

  burbuja.appendChild(meta);
  filaMensaje.appendChild(burbuja);

  chatMessages.appendChild(filaMensaje);
  scrollAlFinal();
}

/* Notificación centrada */
function agregarMensajeSistema(mensaje) {
  const contenedorSistema = document.createElement('div');
  contenedorSistema.classList.add('system-message');

  const span = document.createElement('span');
  span.textContent = mensaje;

  contenedorSistema.appendChild(span);
  chatMessages.appendChild(contenedorSistema);

  scrollAlFinal();
}

/** Desplaza automáticamente la vista al último mensaje */
function scrollAlFinal() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/** Hora actual formateada en 24h (HH:MM) */
function obtenerHoraActual() {
  const ahora = new Date();
  return ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

