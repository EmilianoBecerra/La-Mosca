const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const MesaController = require("./socket/MesaController.js");
const JugadoresController = require("./socket/JugadoresController.js");
const { conectarDB } = require("./db/config.js");
const PartidaController = require("./socket/PartidaController.js");

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000"
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function iniciarServidor () {
  await conectarDB();
  console.log("Base de datos conectada");

  const mesas = [];
  const jugadoresConectados = [];

  const jugadoresController = new JugadoresController(io, jugadoresConectados, mesas);
  const mesaController = new MesaController(io, mesas, jugadoresConectados);
  const partidaController = new PartidaController(io, mesas, jugadoresConectados);
  io.on("connection", (socket) => {
    socket.emit("mesas-disponibles", mesas);
    jugadoresController.registrar(socket);
    mesaController.registrar(socket);
    partidaController.registrar(socket);
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });
}

iniciarServidor();
