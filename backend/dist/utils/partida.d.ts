import type { Carta, Jugador, Mesa } from "../interfaces.js";
export declare function determinarGanador(cartasJugadas: {
    nombre: string;
    carta: Carta;
}[], triunfo: string): {
    nombreGanador: string | undefined;
    carta: {
        palo: string | undefined;
        numero: number | undefined;
    };
};
export declare function juegaCarta(nombreJugador: string, carta: Carta, nombreMesa: string, mesas: Mesa[]): {
    ok: boolean;
    msg: string;
    data?: never;
} | {
    ok: boolean;
    msg: string;
    data: {
        mesa: Mesa;
        jugador: Jugador;
    };
};
export declare function finalizarPartida(nombreMesa: string, mesas: Mesa[]): Promise<{
    ok: boolean;
    msg: string;
    data?: never;
} | {
    ok: boolean;
    msg: string;
    data: {
        mesa: Mesa;
        jugador: Jugador;
    };
}>;
//# sourceMappingURL=partida.d.ts.map