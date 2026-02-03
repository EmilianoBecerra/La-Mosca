import { crearJugador, loginJugador } from "../utils/jugadores.js";
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
        socket.on("registrar-jugador", async (nombre, codigo) => {
            await this.registrarJugador(socket, nombre, codigo);
        });
        socket.on("login", async (nombre, codigo) => {
            await this.loguearJugador(socket, nombre, codigo);
        });
    }
    async registrarJugador(socket, nombre, codigo) {
        try {
            const { ok, msg, data } = await crearJugador(nombre, codigo, this.jugadoresConectados);
            if (!ok) {
                socket.emit("error", msg);
                return;
            }
            socket.emit("jugador-registrado", data);
        }
        catch (error) {
            console.error("Error registrando jugador:", error);
            socket.emit("error-registro", "Error al registrar usuario");
        }
    }
    async loguearJugador(socket, nombre, codigo) {
        try {
            const { ok, msg, data } = await loginJugador(nombre, codigo, this.jugadoresConectados);
            if (!ok) {
                socket.emit("error", msg);
                return;
            }
            socket.emit("loguear-jugador", data);
            const estaEnUnaMesa = buscarMesaDeJugador(nombre, this.mesas);
            if (estaEnUnaMesa.mesa) {
                socket.join(estaEnUnaMesa.mesa.nombre);
                socket.emit("reconectar-partida", estaEnUnaMesa.mesa);
            }
        }
        catch (error) {
            console.error("Error loguear jugador");
            socket.emit("error", "Error al loguear jugador");
        }
    }
}
//# sourceMappingURL=JugadoresController.js.map