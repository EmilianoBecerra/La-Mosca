const { determinarGanador } = require("../utils/partida");

class PartidaController {
  constructor (io, mesas, jugadores) {
    this.io = io;
    this.mesas = mesas;
    this.jugadores = jugadores;
  };

  registrar (socket) {
    socket.on("jugar-carta", ({ idMesa, idJugador, carta }) => {
      this.jugarCarta(socket, { idMesa, idJugador, carta });
    });
  };

  jugarCarta (socket, { idMesa, idJugador, carta }) {
    const mesa = this.mesas.find(m => m._id.toString() === idMesa);

    if (!mesa) return;

    if (mesa.estado !== "en-partida") return;

    const numeroJugadores = mesa.jugadores.length;
    const inicioRonda = mesa.inicioRonda ?? mesa.repartidor + 1;
    const turnoJugador = (inicioRonda + mesa.turnoActual) % numeroJugadores;

    if (mesa.jugadores[turnoJugador]._id.toString() !== idJugador) return;

    const jugador = mesa.jugadores[turnoJugador];
    const indiceCarta = jugador.cartas.findIndex(
      c => c.palo === carta.palo && c.numero === carta.numero
    );

    if (indiceCarta === -1) return;

    jugador.cartas.splice(indiceCarta, 1);

    mesa.cartasPorRonda.push({ id: idJugador, carta });

    this.io.to(idMesa).emit("carta-jugada", { id: idJugador, carta });
    mesa.turnoActual++;
    this.io.to(idMesa).emit("actualizar-mesa", mesa);
    if (mesa.cartasPorRonda.length === mesa.jugadores.length) {
      const { idGanador, carta } = determinarGanador(mesa.cartasPorRonda, mesa.triunfo);
      const ganador = mesa.jugadores.find(j => j._id.toString() === idGanador);
      this.io.to(idMesa).emit("ronda-terminada", { ganador: ganador.nombre, cartaGanadora: carta });
      ganador.puntos -= 1;
      const posicionGanador = mesa.jugadores.findIndex(j => j._id.toString() === idGanador);
      mesa.turnoActual = 0;
      mesa.inicioRonda = posicionGanador;
      mesa.cartasPorRonda = [];
      mesa.ronda++;
      this.io.to(idMesa).emit("actualizar-mesa", mesa);
      const todosJugaron = mesa.jugadores.every(j => j.cartas.length === 0);
      if (todosJugaron) {
        this.io.to(idMesa).emit("fin-mano", mesa);
        mesa.estado = "fin-mano";
      }
    }
  }
}
module.exports = PartidaController;
