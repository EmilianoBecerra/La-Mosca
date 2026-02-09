import { loginJugador, Logout } from "../utils/jugadores.js";
import { buscarMesaDeJugador } from "../utils/mesa.js";
export class JugadoresController {
    io;
    jugadoresConectados;
    mesas;
    constructor(io, jugadoresConectados, mesas) {
        this.io = io;
        this.jugadoresConectados = jugadoresConectados;
        this.mesas = mesas;
    }
    registrar(socket) {
        socket.on("cerrar-sesion", async (nombre) => {
            this.cerrarSesion(socket, nombre);
        });
    }
    cerrarSesion(socket, nombreJugador) {
        const jugador = Logout(nombreJugador, this.jugadoresConectados);
        if (jugador && !jugador.ok) {
            socket.emit("error", "Error al cerrar sesion");
            return;
        }
        socket.emit("sesion-cerrada");
    }
}
//# sourceMappingURL=JugadoresController.js.map