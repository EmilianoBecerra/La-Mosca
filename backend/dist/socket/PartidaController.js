import { determinarGanador, finalizarPartida, juegaCarta } from "../utils/partida.js";
import { obtenerTodasLasMesas } from "../utils/mesa.js";
export class PartidaController {
    io;
    mesas;
    jugadoresConectados;
    constructor(io, mesas, jugadoresConectados) {
        this.io = io;
        this.mesas = mesas;
        this.jugadoresConectados = jugadoresConectados;
    }
    ;
    registrar(socket) {
        socket.on("jugar-carta", ({ nombreMesa, nombreJugador, carta }) => {
            this.jugarCarta(socket, { nombreMesa, nombreJugador, carta });
        });
        socket.on("fin-partida", (nombreMesa) => {
            this.finPartida(socket, nombreMesa);
        });
    }
    ;
    async jugarCarta(socket, { nombreMesa, nombreJugador, carta }) {
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
                    if (nombreGanador) {
                        mesa.ganadoresRonda.push(nombreGanador);
                    }
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
                        if (mesa.ganadoresRonda.length > 0) {
                            for (const jugador of mesa.jugadores) {
                                if (!mesa.ganadoresRonda.includes(jugador.nombre)) {
                                    if (jugador.puntos !== undefined) {
                                        jugador.puntos += 5;
                                    }
                                }
                            }
                        }
                        this.io.to(nombreMesa).emit("fin-mano", mesa);
                        mesa.estado = "fin-mano";
                    }
                    else {
                        this.io.to(nombreMesa).emit("actualizar-mesa", mesa);
                    }
                }
            }
        }
    }
    async finPartida(socket, nombreMesa) {
        const ganador = await finalizarPartida(nombreMesa, this.mesas);
        if (!ganador?.ok) {
            socket.emit("error", "error al identificar ganador");
            return;
        }
        if (ganador?.ok) {
            await this.sincronizarYEmitirMesas();
            this.io.to(nombreMesa).emit("ganador", ganador.data?.jugador);
        }
    }
    async sincronizarYEmitirMesas() {
        const mesasActualizadas = await obtenerTodasLasMesas(this.mesas);
        this.io.emit("mesas-disponibles", mesasActualizadas);
    }
}
//# sourceMappingURL=PartidaController.js.map