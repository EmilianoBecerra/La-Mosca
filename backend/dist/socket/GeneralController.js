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
        try {
            const jugadores = await devolverJugadoresRanking();
            if (!jugadores) {
                socket.emit("error", "error al encontrar jugadores globales");
            }
            this.io.emit("ranking-global", jugadores.data);
        }
        catch (error) {
            console.error("Error al mostrar ranking global");
            socket.emit("error", "Error al mostrar ranking global");
        }
    }
}
//# sourceMappingURL=GeneralController.js.map