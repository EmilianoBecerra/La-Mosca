const { jugadorModel } = require("../model/JugadorModel");

class JugadoresController {
  constructor (io, jugadoresConectados, mesas) {
    this.io = io;
    this.jugadores = jugadoresConectados;
    this.mesas = mesas;
  }

  registrar (socket) {
    socket.on("registrar-jugador", async (nombre) => {
      await this.registrarJugador(socket, nombre);
    });

    socket.on("obtener-jugador", async (id) => {
      await this.obtenerJugador(socket, id);
    });

    socket.on("disconnect", () => {
      this.desconectarJugador(socket);
    });
  }

  async registrarJugador (socket, nombre) {
    try {
      const existente = await jugadorModel.findOne({ nombre });
      if (existente) {
        socket.emit("error-registro", "Ya existe un jugador con ese nombre");
        return;
      }

      const jugador = await jugadorModel.create({ nombre, puntosGlobales: 0 });
      const jugadorConectado = {
        _id: jugador._id,
        nombre: jugador.nombre,
        puntosGlobales: jugador.puntosGlobales,
        socketId: socket.id
      };
      this.jugadores.push(jugadorConectado);

      socket.emit("jugador-registrado", jugador);
    } catch (error) {
      console.error("Error registrando jugador:", error);
      socket.emit("error-registro", "Error al registrar usuario");
    }
  }

  async obtenerJugador (socket, id) {
    try {
      if (!id) return;

      const jugador = await jugadorModel.findById(id);
      if (!jugador) {
        socket.emit("error-registro", "Jugador no encontrado");
        return;
      }
      const yaConectado = this.jugadores.find(j => j._id.toString() === id);
      if (yaConectado) {
        yaConectado.socketId = socket.id;
      } else {
        this.jugadores.push({
          _id: jugador._id,
          nombre: jugador.nombre,
          puntosGlobales: jugador.puntosGlobales,
          socketId: socket.id
        });
      }

      socket.emit("info-jugador", jugador);

      const mesa = this.mesas.find(m =>
        m.jugadores.some(j => j._id.toString() === id)
      );

      if (mesa) {
        socket.join(mesa._id.toString());
        if (mesa.estado === "esperando-jugadores") {
          socket.emit("mesa-jugador", mesa);
        } else {
          socket.emit("reconectar-partida", mesa);
        }
      }
    } catch (error) {
      console.error("Error obteniendo jugador:", error);
      socket.emit("error-registro", "Error al obtener jugador");
    }
  }

  desconectarJugador (socket) {
    const index = this.jugadores.findIndex(j => j.socketId === socket.id);
    if (index !== -1) {
      const jugador = this.jugadores[index];
      console.log(`Jugador desconectado: ${jugador.nombre}`);
    }
  }
}

module.exports = JugadoresController;
