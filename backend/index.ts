import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { conectarDB } from "./db/config.js";
import { MesaController } from "./socket/MesaController.js";
import { PartidaController } from "./socket/PartidaController.js";
import type { Jugador, Mesa } from "./interfaces.js";
import { buscarMesaDeJugador, obtenerMesasLobby, obtenerTodasLasMesas } from "./utils/mesa.js";
import { GeneralController } from "./socket/GeneralController.js";
import authRoutes from "./routes/auth.js";
import jwt, { type JwtPayload, type VerifyErrors } from "jsonwebtoken";
import compression from "compression";

const app = express();
const server = createServer(app);
const PORT = Number(process.env.PORT) || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN
  }
});

app.use(compression());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "POST");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);

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

  const mesaController = new MesaController(io, mesas, jugadoresConectados);
  const partidaController = new PartidaController(io, mesas, jugadoresConectados);
  const generalController = new GeneralController(io, mesas, jugadoresConectados);
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    socket.data.windowId = socket.handshake.auth.windowId;
    if (!token || !PRIVATE_KEY) {
      return next();
    }
    jwt.verify(token, PRIVATE_KEY, (error: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (error) return next();
      const payload = decoded as JwtPayload;
      socket.data.nombre = payload.nombre;
      next();
    });
  });

  io.on("connection", (socket) => {
    socket.on("pedir-mesas", async () => {
      const mesasLobby = await obtenerMesasLobby();
      socket.emit("mesas-disponibles", mesasLobby);
    });
    
    const nombre = socket.data.nombre;
    const windowId = socket.data.windowId;
    if (nombre) {
      const existente = jugadoresConectados.find(j => j.nombre === nombre);
      if (existente && existente.windowId !== windowId) {
        if (existente.socketId) {
          io.to(existente.socketId).emit("otra-ventana");
          existente.socketId = socket.id;
          existente.windowId = windowId;
        }
      } else if (existente) {
        if (existente.socketId) {
          existente.socketId = socket.id;
        }
      } else {
        jugadoresConectados.push({ nombre, socketId: socket.id, windowId });
      }

      const resultado = buscarMesaDeJugador(nombre, mesas);
      if (resultado.data) {
        const { mesa } = resultado.data;
        if (mesa) {
          socket.join(mesa.nombre);
          socket.emit("reconectar-partida", mesa);
        }
      }
    }
    obtenerMesasLobby().then(mesasLobby => {
      socket.emit("mesas-disponibles", mesasLobby);
    });
    mesaController.registrar(socket);
    partidaController.registrar(socket);
    generalController.registrar(socket);



    socket.on("autenticar", (token: string) => {
      if (!token || !PRIVATE_KEY) return;
      jwt.verify(token, PRIVATE_KEY, (error: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
        if (error) return;
        const payload = decoded as JwtPayload;
        const nombre = payload.nombre;
        socket.data.nombre = nombre;

        const existente = jugadoresConectados.find(j => j.nombre === nombre);
        if (existente && existente.windowId !== windowId && existente.socketId) {
          io.to(existente.socketId).emit("otra-ventana");
          existente.socketId = socket.id;
          existente.windowId = windowId;
        } else if (existente) {
          existente.socketId = socket.id;
        } else {
          jugadoresConectados.push({ nombre, socketId: socket.id, windowId });
        }
      });
    });

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
