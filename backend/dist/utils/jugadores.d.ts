import type { Jugador } from "../interfaces.js";
export declare function crearJugador(nombre: string, codigo: string, jugadores: Jugador[]): Promise<{
    ok: boolean;
    msg: string;
    data?: never;
} | {
    ok: boolean;
    msg: string;
    data: Jugador;
}>;
export declare function loginJugador(nombre: string, codigo: string, jugadores: Jugador[]): Promise<{
    ok: boolean;
    msg: string;
    data?: never;
} | {
    ok: boolean;
    msg: string;
    data: Jugador;
}>;
export declare function listoParaJugar(nombre: string, jugadores: Jugador[]): {
    ok: boolean;
    msg: string;
    data?: never;
} | {
    ok: boolean;
    msg: string;
    data: Jugador;
};
//# sourceMappingURL=jugadores.d.ts.map