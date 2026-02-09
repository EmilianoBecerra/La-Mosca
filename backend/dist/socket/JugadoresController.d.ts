import type { Server, Socket } from "socket.io";
import type { Jugador, Mesa } from "../interfaces.js";
export declare class JugadoresController {
    private io;
    jugadoresConectados: Jugador[];
    mesas: Mesa[];
    constructor(io: Server, jugadoresConectados: Jugador[], mesas: Mesa[]);
    registrar(socket: Socket): void;
    cerrarSesion(socket: Socket, nombreJugador: string): void;
}
//# sourceMappingURL=JugadoresController.d.ts.map