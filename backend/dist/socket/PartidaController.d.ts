import type { Server, Socket } from "socket.io";
import type { Carta, Jugador, Mesa } from "../interfaces.js";
interface jugarCartasParams {
    nombreMesa: string;
    nombreJugador: string;
    carta: Carta;
}
export declare class PartidaController {
    private io;
    mesas: Mesa[];
    jugadoresConectados: Jugador[];
    constructor(io: Server, mesas: Mesa[], jugadoresConectados: Jugador[]);
    registrar(socket: Socket): void;
    jugarCarta(socket: Socket, { nombreMesa, nombreJugador, carta }: jugarCartasParams): Promise<void>;
    private sincronizarYEmitirMesas;
}
export {};
//# sourceMappingURL=PartidaController.d.ts.map