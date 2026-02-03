import type { Server, Socket } from "socket.io";
import type { Jugador, Mesa } from "../interfaces.js";
export declare class MesaController {
    private io;
    mesas: Mesa[];
    jugadoresConectados: Jugador[];
    constructor(io: Server, mesas: Mesa[], jugadoresConectados: Jugador[]);
    registrar(socket: Socket): void;
    crearNuevaMesa(socket: Socket, nombreJugador: string, nombreMesa: string): Promise<void>;
    sumarJugador(socket: Socket, nombreJugador: string, nombreMesa: string): Promise<void>;
    jugadorListo(socket: Socket, nombreJugador: string): Promise<void>;
    iniciarPartida(mesa: Mesa): Promise<void>;
    recibirDescarte(socket: Socket, nombreJugador: string, indices: number[], nombreMesa: string): Promise<void>;
    procesarDescarte(mesa: Mesa, jugadores: Jugador[]): Promise<void>;
    iniciarNuevaMano(nombreMesa: string): void;
    sacarJugador(socket: Socket, nombreJugador: string): Promise<void>;
    borrarMesa(socket: Socket, nombreMesa: string): void;
    private sincronizarYEmitirMesas;
}
//# sourceMappingURL=MesaController.d.ts.map