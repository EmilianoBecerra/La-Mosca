import type { Server, Socket } from "socket.io";
import type { Jugador, Mesa } from "../interfaces.js";
export declare class GeneralController {
    private io;
    mesas: Mesa[];
    jugadoresConectados: Jugador[];
    constructor(io: Server, mesas: Mesa[], jugadoresConectados: Jugador[]);
    registrar(socket: Socket): void;
    mostrarRanking(socket: Socket): Promise<void>;
}
//# sourceMappingURL=GeneralController.d.ts.map