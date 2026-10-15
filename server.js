import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import { env } from "process";
import { consultarIA } from "./src/js/ai.service.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const port = env.PORT || 3000;
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado con ID:", socket.id);

  socket.on("chat:message", async (data) => {
    io.emit("chat:message", data);

    const respuesta = await consultarIA(data.text);
    const mensajeIA = {
      username: "Asistente WhatsChatGPT",
      text: respuesta,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      socketId: "bot",
    };

    io.emit("chat:message", mensajeIA);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
