import type { Server, Socket } from "socket.io";
import type { Jugador, Mesa } from "../interfaces.js";
import { devolverJugadoresRanking } from "../utils/general.js";

export class GeneralController {
  constructor(private io: Server, public mesas: Mesa[], public jugadoresConectados: Jugador[]) { }


  registrar(socket: Socket) {
    socket.on("actualizar-ranking", () => {
      this.mostrarRanking(socket);
    })
  }

  async mostrarRanking(socket: Socket) {
    const jugadores = await devolverJugadoresRanking();
    if (!jugadores) {
      socket.emit("error", "error al encontrar jugadores globales");
    }
    this.io.emit("ranking-global", jugadores.data);
  }
}