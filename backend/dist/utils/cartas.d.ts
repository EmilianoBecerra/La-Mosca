import type { Carta, Mesa } from "../interfaces.js";
export declare const paloNumero: {
    palo: string[];
    numeros: number[];
};
export declare function crearMazo(): Carta[];
export declare function mezclarMazo(mazo: Carta[]): Carta[];
export declare function repartirCartas(mesa: Mesa): void;
export declare function descartarCartas(mesa: Mesa, nombreJugador: string): void;
export declare function repartirPostDescarte(mesa: Mesa): void;
//# sourceMappingURL=cartas.d.ts.map