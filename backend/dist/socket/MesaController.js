import { buscarMesaDeJugador, crearMesa, descartar, obtenerMesasLobby, obtenerTodasLasMesas, realizarDescarte, salirDeMesa, unirseAMesa } from "../utils/mesa.js";
import { crearMazo, descartarCartas, mezclarMazo, repartirCartas, repartirPostDescarte } from "../utils/cartas.js";
export class MesaController {
    io;
    mesas;
    jugadoresConectados;
    constructor(io, mesas, jugadoresConectados) {
        this.io = io;
        this.mesas = mesas;
        this.jugadoresConectados = jugadoresConectados;
    }
    registrar(socket) {
        socket.on("crear-mesa", (nombreJugador, nombreMesa) => {
            this.crearNuevaMesa(socket, nombreJugador, nombreMesa);
        });
        socket.on("ingresar-en-mesa", (nombreJugador, nombreMesa) => {
            this.sumarJugador(socket, nombreJugador, nombreMesa);
        });
        socket.on("salir-mesa", (nombreJugador) => {
            this.sacarJugador(socket, nombreJugador);
        });
        socket.on("jugador-listo", (nombreJugador) => {
            this.jugadorListo(socket, nombreJugador);
        });
        socket.on("descarte", (nombreJugador, indices, nombreMesa) => {
            this.recibirDescarte(socket, nombreJugador, indices, nombreMesa);
        });
        socket.on("nueva-mano", (nombreMesa) => {
            this.iniciarNuevaMano(socket, nombreMesa);
        });
        socket.on("borrar-mesa", (nombreMesa) => {
            this.borrarMesa(socket, nombreMesa);
        });
    }
    ;
    async crearNuevaMesa(socket, nombreJugador, nombreMesa) {
        try {
            const mesaNueva = await crearMesa(nombreJugador, nombreMesa, this.mesas);
            if (!mesaNueva.ok) {
                socket.emit("error", "Error al crear Mesa nueva");
                return;
            }
            if (mesaNueva.ok && mesaNueva.msg === "estas-en-una-mesa") {
                socket.emit("jugador-enMesa", mesaNueva.data.mesa);
                await this.sincronizarYEmitirMesas(socket);
                return;
            }
            if (mesaNueva.data.mesa?.nombre) {
                socket.join(mesaNueva.data.mesa.nombre);
                await this.sincronizarYEmitirMesas(socket);
                socket.emit("mesa_creada_exito", mesaNueva.data.mesa.nombre);
            }
        }
        catch (error) {
            console.error("Falló creación Mesa nueva servidor");
            socket.emit("error", "Error al crear Mesa nueva");
        }
    }
    async sumarJugador(socket, nombreJugador, nombreMesa) {
        try {
            const resultado = await unirseAMesa(nombreJugador, this.jugadoresConectados, nombreMesa, this.mesas);
            if (!resultado?.ok) {
                socket.emit("error", resultado.msg);
                return;
            }
            if (resultado.ok) {
                const { mesa, jugador } = resultado.data;
                if (resultado.ok && (resultado.msg === "ya-en-mesa" || resultado.msg === "ya-en-estaMesa")) {
                    socket.emit("jugador-enMesa", mesa);
                    return;
                }
                if (mesa) {
                    socket.join(mesa.nombre);
                    socket.emit("confirmacion-registro", mesa);
                    socket.broadcast.to(mesa.nombre).emit("jugador-nuevo", jugador);
                    this.io.emit("mesas-disponibles", await obtenerTodasLasMesas(this.mesas));
                }
            }
        }
        catch (error) {
            console.error("Falló ingreso a Mesa servidor");
            socket.emit("error", "Error al ingresar a Mesa");
        }
    }
    ;
    async jugadorListo(socket, nombreJugador) {
        try {
            const resultado = buscarMesaDeJugador(nombreJugador, this.mesas);
            if (!resultado.ok) {
                socket.emit("error", resultado.msg);
                return;
            }
            if (resultado.data) {
                const { mesa, jugador } = resultado.data;
                if (!mesa) {
                    socket.emit("error", "No estás en ninguna mesa");
                    return;
                }
                if (!jugador) {
                    socket.emit("error", "Jugador no encontrado en la mesa");
                    return;
                }
                jugador.ready = true;
                this.io.to(mesa.nombre).emit("actualizar-mesa", mesa);
                await this.sincronizarYEmitirMesas(socket);
                const todosListos = mesa.jugadores.length >= 2 && mesa.jugadores.every(j => j.ready);
                if (todosListos) {
                    this.iniciarPartida(socket, mesa);
                }
            }
        }
        catch (error) {
            console.error("Error al iniciar partida");
            socket.emit("error", "Error al iniciar partida");
        }
    }
    async iniciarPartida(socket, mesa) {
        try {
            mesa.mazo = mezclarMazo(crearMazo());
            repartirCartas(mesa);
            const todosCon5cartas = mesa.jugadores.every(j => j.cartas?.length === 5);
            if (todosCon5cartas) {
                mesa.estado = "descarte";
                this.io.to(mesa.nombre).emit("esperando-descarte", mesa);
            }
        }
        catch (error) {
            console.error("Error al iniciar partida");
            socket.emit("error", "Error al iniciar partida");
        }
    }
    async recibirDescarte(socket, nombreJugador, indices, nombreMesa) {
        try {
            const resultado = realizarDescarte(nombreJugador, indices, nombreMesa, this.mesas);
            if (!resultado?.ok) {
                socket.emit("error", resultado.msg);
                return;
            }
            if (resultado.ok) {
                const mesa = resultado.data.mesa;
                if (mesa) {
                    const jugadores = mesa.jugadores;
                    if (jugadores) {
                        if (jugadores.every(j => j.listoParaDescartar === true)) {
                            this.procesarDescarte(socket, mesa, jugadores);
                        }
                        else {
                            this.io.to(mesa.nombre).emit("actualizar-mesa", mesa);
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error("Error al realizar descarte");
            socket.emit("error", "Error al realizar descarte");
        }
    }
    async procesarDescarte(socket, mesa, jugadores) {
        try {
            const resultado = descartar(mesa, jugadores);
            if (resultado.ok) {
                repartirPostDescarte(mesa);
                mesa.estado = "en-partida";
                this.io.to(mesa.nombre).emit("listos-jugar", mesa);
            }
        }
        catch (error) {
            console.error("Error al procesar descarte");
            socket.emit("error", "Error al procesar descarte");
        }
    }
    iniciarNuevaMano(socket, nombreMesa) {
        try {
            const mesa = this.mesas.find(m => m.nombre === nombreMesa);
            if (!mesa || mesa.estado !== "fin-mano")
                return;
            mesa.ronda = 0;
            mesa.turnoActual = 0;
            mesa.cartasPorRonda = [];
            mesa.inicioRonda = undefined;
            mesa.repartidor = (mesa.repartidor + 1) % mesa.jugadores.length;
            mesa.ganadoresRonda = [];
            mesa.jugadores.forEach(j => {
                j.cartas = [];
                j.listoParaDescartar = false;
                j.descarte = [];
            });
            this.iniciarPartida(socket, mesa);
        }
        catch (error) {
            console.error("Error al iniciar nueva mano");
            socket.emit("error", "Error al iniciar nueva mano");
        }
    }
    async sacarJugador(socket, nombreJugador) {
        try {
            const resultado = await salirDeMesa(nombreJugador, this.mesas);
            if (!resultado.ok) {
                socket.emit("error", resultado.msg);
                return;
            }
            const { mesa } = resultado.data;
            if (mesa?.nombre) {
                if (resultado.msg === "eliminar toda la mesa") {
                    this.io.to(mesa.nombre).emit("mesa-eliminada", mesa);
                    this.io.in(mesa.nombre).socketsLeave(mesa.nombre);
                }
                else {
                    socket.broadcast.to(mesa.nombre).emit("jugador-salio", { nombreJugador, mesa });
                    socket.leave(mesa.nombre);
                }
                socket.emit("saliste-mesa");
                await this.sincronizarYEmitirMesas(socket);
            }
        }
        catch (error) {
            console.error("Error al sacar jugador");
            socket.emit("error", "Error al sacar jugador");
        }
    }
    async borrarMesa(socket, nombreMesa) {
        try {
            const indiceMesa = this.mesas.findIndex(m => m.nombre === nombreMesa);
            if (indiceMesa === -1) {
                socket.emit("error", "no existe la mesa");
                return;
            }
            const [mesaAQuitar] = this.mesas.splice(indiceMesa, 1);
            this.io.to(nombreMesa).emit("mesa-eliminada", mesaAQuitar);
            this.io.in(nombreMesa).socketsLeave(nombreMesa);
            await this.sincronizarYEmitirMesas(socket);
            socket.emit("confirmar-eliminacion", mesaAQuitar);
        }
        catch (error) {
            console.error("Error al borrar mesa");
            socket.emit("error", "Error al borrar mesa");
        }
    }
    async sincronizarYEmitirMesas(socket) {
        try {
            await obtenerTodasLasMesas(this.mesas);
            const mesasLobby = await obtenerMesasLobby();
            this.io.emit("mesas-disponibles", mesasLobby);
        }
        catch (error) {
            console.error("Error al sincronizar y emitir mesas");
            socket.emit("error", "Error al sincronizar mesas");
        }
    }
}
//# sourceMappingURL=MesaController.js.map