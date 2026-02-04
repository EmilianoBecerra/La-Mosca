import { crearJugador, loginJugador, Logout } from "../utils/jugadores.js";
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
        socket.on("cerrar-sesion", async (nombre) => {
            this.cerrarSesion(socket, nombre);
        });
    }
    async registrarJugador(socket, nombre, codigo) {
        try {
            const { ok, msg, data } = await crearJugador(nombre, codigo, this.jugadoresConectados, socket.id);
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
            const { ok, msg, data } = await loginJugador(nombre, codigo, this.jugadoresConectados, socket.id);
            if (!ok) {
                socket.emit("error", msg);
                return;
            }
            if (msg === "Jugador ya conectado") {
                socket.emit("jugador-logueado");
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