import type { Jugador, Mesa } from "../interfaces.js";
type DataReturn = {
    ok: true;
    msg: string;
    data: {
        mesa?: Mesa;
        jugador?: Jugador;
    };
} | {
    ok: false;
    msg: string;
};
export declare function crearMesa(nombreJugador: string, nombreMesa: string, mesas: Mesa[], jugadores: Jugador[]): Promise<DataReturn>;
export declare function unirseAMesa(nombreJugador: string, jugadores: Jugador[], nombreMesa: string, mesas: Mesa[]): Promise<DataReturn>;
export declare function realizarDescarte(nombreJugador: string, indices: number[], nombreMesa: string, mesas: Mesa[]): DataReturn;
export declare function descartar(mesa: Mesa, jugadores: Jugador[]): {
    ok: boolean;
    msg: string;
    data: Mesa;
};
export declare function salirDeMesa(nombreJugador: string, mesas: Mesa[]): Promise<DataReturn>;
export declare function obtenerTodasLasMesas(mesas: Mesa[]): Promise<Mesa[]>;
export declare function buscarMesaDeJugador(nombreJugador: string, mesas: Mesa[]): {
    mesa: Mesa | undefined;
    jugador: Jugador | undefined;
};
export declare function obtenerMesasDisponibles(mesas: Mesa[]): Mesa[];
export {};
//# sourceMappingURL=mesa.d.ts.map