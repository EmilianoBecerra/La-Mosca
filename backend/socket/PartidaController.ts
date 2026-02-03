import type { Server, Socket } from "socket.io";
import { determinarGanador, juegaCarta } from "../utils/partida.js";
import type { Carta, Jugador, Mesa } from "../interfaces.js";
import { obtenerTodasLasMesas } from "../utils/mesa.js";

interface jugarCartasParams {
  nombreMesa: string;
  nombreJugador: string;
  carta: Carta;
}

export class PartidaController {
  constructor(private io: Server, public mesas: Mesa[], public jugadoresConectados: Jugador[]) {
  };

  registrar(socket: Socket) {
    socket.on("jugar-carta", ({ nombreMesa, nombreJugador, carta }) => {
      this.jugarCarta(socket, { nombreMesa, nombreJugador, carta });
    });
  };

  async jugarCarta(socket: Socket, { nombreMesa, nombreJugador, carta }: jugarCartasParams) {
    const resultado = juegaCarta(nombreJugador, carta, nombreMesa, this.mesas);
    if (!resultado.ok) {
      socket.emit("error", "Error al jugar una carta");
      return;
    }
    if (resultado.ok) {
      this.io.to(nombreMesa).emit("carta-jugada", { nombre: nombreJugador, carta });
      if (resultado.data?.mesa) {
        const mesa = resultado.data.mesa;
        mesa.turnoActual++;
        this.io.to(nombreMesa).emit("actualizar-mesa", mesa);
        if (mesa.cartasPorRonda.length === mesa.jugadores.length) {
          const { nombreGanador, carta } = determinarGanador(mesa.cartasPorRonda, mesa.triunfo);
          const ganador = mesa.jugadores.find(j => j.nombre === nombreGanador);
          this.io.to(nombreMesa).emit("ronda-terminada", { ganador: ganador?.nombre, cartaGanadora: carta, cartasJugadas: mesa.cartasPorRonda });
          if (ganador?.puntos) {
            ganador.puntos--;
          }
          const posicionGanador = mesa.jugadores.findIndex(j => j.nombre === nombreGanador);
          mesa.turnoActual = 0;
          mesa.inicioRonda = posicionGanador;
          mesa.cartasPorRonda = [];
          mesa.ronda++;
          await this.sincronizarYEmitirMesas();
          const todosJugaron = mesa.jugadores.every(j => j.cartas?.length === 0);
          if (todosJugaron) {
            this.io.to(nombreMesa).emit("fin-mano", mesa);
            mesa.estado = "fin-mano";
          } else {
            this.io.to(nombreMesa).emit("actualizar-mesa", mesa);
          }
        }
      }
    }
  }

  private async sincronizarYEmitirMesas() {
    const mesasActualizadas = await obtenerTodasLasMesas(this.mesas);
    this.io.emit("mesas-disponibles", mesasActualizadas);
  }
}

