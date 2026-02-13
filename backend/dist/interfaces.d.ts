import { Types } from "mongoose";
export interface Mesa {
    _id?: Types.ObjectId;
    nombre: string;
    estado: string;
    fase: string;
    jugadores: Jugador[];
    mazo: Carta[];
    triunfo: string;
    turnoActual: number;
    inicioRonda: undefined | number;
    repartidor: number;
    cartasPorRonda: {
        nombre: string;
        carta: Carta;
    }[];
    ganadoresRonda: string[];
    ronda: number;
}
export interface Jugador {
    nombre: string;
    socketId?: string;
    windowId?: string;
    mesaID?: string;
    cartas?: Carta[];
    posicionMesa?: number;
    puntos?: number;
    ready?: boolean;
    listoParaDescartar?: boolean;
    descarte?: number[];
    puntosGlobales?: number;
}
export interface Carta {
    nombre?: string;
    palo: string;
    numero: number;
}
export interface PuntosGlobales {
    jugador: string;
    puntos: number;
}
//# sourceMappingURL=interfaces.d.ts.map