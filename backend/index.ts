import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { conectarDB } from "./db/config.js";
import { JugadoresController } from "./socket/JugadoresController.js";
import { MesaController } from "./socket/MesaController.js";
import { PartidaController } from "./socket/PartidaController.js";
import type { Jugador, Mesa } from "./interfaces.js";
import { obtenerTodasLasMesas } from "./utils/mesa.js";
import { GeneralController } from "./socket/GeneralController.js";


const app = express();
const server = createServer(app);
const PORT = Number(process.env.PORT) || 3000;
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173"
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function iniciarServidor() {
  try {
    await conectarDB();
    console.log("Base de datos conectada");
  } catch (error) {
    console.error("No se pudo conectar a la BD");
  }
  let mesas: Mesa[] = [];
  mesas = await obtenerTodasLasMesas(mesas);
  const jugadoresConectados: Jugador[] = [];
  console.log("iniciado")
  const jugadoresController = new JugadoresController(io, jugadoresConectados, mesas);
  const mesaController = new MesaController(io, mesas, jugadoresConectados);
  const partidaController = new PartidaController(io, mesas, jugadoresConectados);
  const generalController = new GeneralController(io, mesas, jugadoresConectados);
  io.on("connection", (socket) => {
    socket.emit("mesas-disponibles", mesas);
    jugadoresController.registrar(socket);
    mesaController.registrar(socket);
    partidaController.registrar(socket);
    generalController.registrar(socket);

    socket.on("disconnect", () => {
      const index = jugadoresConectados.findIndex(j => j.socketId === socket.id);
      if (index !== -1) {
        jugadoresConectados.splice(index, 1);
      }
    });
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });
}

iniciarServidor();
