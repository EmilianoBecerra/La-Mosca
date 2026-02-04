import { devolverJugadoresRanking } from "../utils/general.js";
export class GeneralController {
    io;
    mesas;
    jugadoresConectados;
    constructor(io, mesas, jugadoresConectados) {
        this.io = io;
        this.mesas = mesas;
        this.jugadoresConectados = jugadoresConectados;
    }
    registrar(socket) {
        socket.on("actualizar-ranking", () => {
            this.mostrarRanking(socket);
        });
    }
    async mostrarRanking(socket) {
        const jugadores = await devolverJugadoresRanking();
        if (!jugadores) {
            socket.emit("error", "error al encontrar jugadores globales");
        }
        this.io.emit("ranking-global", jugadores.data);
    }
}
//# sourceMappingURL=GeneralController.js.map