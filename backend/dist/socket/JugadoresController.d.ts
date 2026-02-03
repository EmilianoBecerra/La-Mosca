import type { Server, Socket } from "socket.io";
import type { Jugador, Mesa } from "../interfaces.js";
export declare class JugadoresController {
    private io;
    jugadoresConectados: Jugador[];
    mesas: Mesa[];
    constructor(io: Server, jugadoresConectados: Jugador[], mesas: Mesa[]);
    registrar(socket: Socket): void;
    registrarJugador(socket: Socket, nombre: string, codigo: string): Promise<void>;
    loguearJugador(socket: Socket, nombre: string, codigo: string): Promise<void>;
}
//# sourceMappingURL=JugadoresController.d.ts.map