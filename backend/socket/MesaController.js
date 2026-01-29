const { crearMazo, mezclarMazo, repartirCartas, descartarCartas, repartirPostDescarte } = require("../utils/cartas.js");
const { crearMesa, unirseAMesa, salirDeMesa, buscarMesaDeJugador } = require("../utils/mesa.js");

class MesaController {
  constructor (io, mesas, jugadoresConectados) {
    this.io = io;
    this.mesas = mesas;
    this.jugadores = jugadoresConectados;
    this.timers = new Map();
  }

  registrar (socket) {
    socket.on("crear-mesa", (idJugador, nombreMesa) => {
      this.crearNuevaMesa(socket, idJugador, nombreMesa);
    });

    socket.on("registrar-en-mesa", (idJugador, idMesa) => {
      this.sumarJugador(socket, idJugador, idMesa);
    });

    socket.on("salir-mesa", (idJugador) => {
      this.sacarJugador(socket, idJugador);
    });

    socket.on("jugador-listo", (id) => {
      this.jugadorListo(socket, id);
    });

    socket.on("descarte", (idJugador, indices, idMesa) => {
      this.recibirDescarte(socket, idJugador, indices, idMesa);
    });

    socket.on("nueva-mano", (idMesa) => {
      this.iniciarNuevaMano(idMesa);
    });

    socket.on("borrar-mesa", (idMesa) => {
      this.borrarMesa(socket, idMesa);
    });
  };

  sacarJugador (socket, idJugador) {
    const resultado = salirDeMesa(idJugador, this.mesas);

    if (!resultado.ok) {
      socket.emit("error", resultado.msg);
      return;
    }
    const mesa = resultado.data;
    const idMesa = mesa._id.toString();
    if (resultado.msg === "eliminar toda la mesa") {
      this.borrarMesa(socket, idMesa);
      return;
    }
    mesa.jugadores = mesa.jugadores.filter(j => j._id.toString() !== idJugador);
    mesa.jugadores.forEach((j, index) => {
      j.posicionMesa = index;
    });

    socket.broadcast.to(idMesa).emit("jugador-salio", { idJugador, mesa });
    socket.leave(idMesa);
    socket.emit("saliste-mesa");
    this.io.emit("mesas-disponibles", this.mesas);
  }

  crearNuevaMesa (socket, idJugador, nombreMesa) {
    const jugador = this.jugadores.find(j => j._id.toString() === idJugador);

    if (!jugador) {
      socket.emit("error", "Jugador no encontrado. Registrate primero.");
      return;
    }

    const resultado = crearMesa(jugador, nombreMesa, this.mesas);

    if (resultado.ok) {
      socket.join(resultado.data._id.toString());
      socket.emit("mesa-creada", resultado.data);
      this.io.emit("mesas-disponibles", this.mesas);
    } else if (resultado.data) {
      socket.join(resultado.data._id.toString());
      socket.emit("mesa-jugador", resultado.data);
    } else {
      socket.emit("error", resultado.msg);
    }
  }

  sumarJugador (socket, idJugador, idMesa) {
    const jugador = this.jugadores.find(j => j._id.toString() === idJugador);

    if (!jugador) {
      socket.emit("error", "Jugador no encontrado. Registrate primero.");
      return;
    }

    const resultado = unirseAMesa(jugador, idMesa, this.mesas);

    if (resultado.ok) {
      const { mesa, jugador: nuevoJugador } = resultado.data;
      socket.join(mesa._id.toString());
      socket.emit("confirmacion-registro", mesa);
      socket.broadcast.to(mesa._id.toString()).emit("jugador-nuevo", nuevoJugador);
      this.io.emit("mesas-disponibles", this.mesas);
    } else if (resultado.data) {
      socket.join(resultado.data._id.toString());
      socket.emit("mesa-jugador", resultado.data);
    } else {
      socket.emit("error", resultado.msg);
    }
  }

  jugadorListo (socket, id) {
    const mesa = buscarMesaDeJugador(id, this.mesas);

    if (!mesa) {
      socket.emit("error", "No estás en ninguna mesa");
      return;
    }
    const jugador = mesa.jugadores.find(j => j._id.toString() === id);
    if (!jugador) {
      socket.emit("error", "Jugador no encontrado en la mesa");
      return;
    }

    jugador.ready = true;

    this.io.to(mesa._id.toString()).emit("actualizar-mesa", mesa);

    const todosListos = mesa.jugadores.length >= 2 && mesa.jugadores.every(j => j.ready);

    if (todosListos) {
      this.iniciarPartida(mesa);
    }
  }

  iniciarPartida (mesa) {
    mesa.mazo = mezclarMazo(crearMazo());
    repartirCartas(mesa);

    const todosCon5cartas = mesa.jugadores.every(j => j.cartas.length === 5);

    if (todosCon5cartas) {
      mesa.estado = "descarte";
      this.timers.set(mesa._id.toString(), setTimeout(() => {
        this.procesarDescarte(mesa);
      }, 300000));
      this.io.to(mesa._id.toString()).emit("esperando-descarte", mesa);
    }
  }

  recibirDescarte (socket, idJugador, indices, idMesa) {
    const mesa = this.mesas.find(m => m._id.toString() === idMesa);
    if (!mesa) {
      socket.emit("error", "error al buscar la mesa");
      return;
    }
    const jugador = mesa.jugadores.find(j => j._id.toString() === idJugador);
    if (!jugador) {
      socket.emit("error", "error al encontrar al jugador");
      return;
    }
    if (jugador.listoParaDescartar === false) {
      jugador.descarte = indices;
      jugador.listoParaDescartar = true;
      this.io.to(mesa._id.toString()).emit("actualizar-mesa", mesa);
    }
    const jugadores = mesa.jugadores;
    if (jugadores.every(j => j.listoParaDescartar === true)) {
      clearTimeout(this.timers.get(mesa._id));
      this.procesarDescarte(mesa);
    }
  }

  procesarDescarte (mesa) {
    const jugadores = mesa.jugadores;
    for (const jugador of jugadores) {
      if (jugador.descarte.length > 0) {
        descartarCartas(mesa, jugador._id.toString());
      } else {
        continue;
      }
    }
    repartirPostDescarte(mesa);
    mesa.estado = "en-partida";
    this.io.to(mesa._id.toString()).emit("listos-jugar", mesa);
  }

  iniciarNuevaMano (idMesa) {
    const mesa = this.mesas.find(m => m._id.toString() === idMesa);
    if (!mesa || mesa.estado !== "fin-mano") return;
    mesa.ronda = 0;
    mesa.turnoActual = 0;
    mesa.cartasPorRonda = [];
    mesa.inicioRonda = undefined;
    mesa.repartidor = (mesa.repartidor + 1) % mesa.jugadores.length;
    mesa.jugadores.forEach(j => {
      j.cartas = [];
      j.listoParaDescartar = false;
      j.descarte = [];
    });
    this.iniciarPartida(mesa);
  }

  borrarMesa (socket, idMesa) {
    const indiceMesa = this.mesas.findIndex(m => m._id.toString() === idMesa);
    if (indiceMesa === -1) {
      socket.emit("error", "no existe la mesa");
      return;
    }
    const [mesaAQuitar] = this.mesas.splice(indiceMesa, 1);
    this.io.to(idMesa).emit("mesa-eliminada", mesaAQuitar);
    this.io.in(idMesa).socketsLeave(idMesa);
    this.io.emit("mesas-disponibles", this.mesas);

    socket.emit("confirmar-eliminacion", mesaAQuitar);
  }
}

module.exports = MesaController;
