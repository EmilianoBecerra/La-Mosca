import type { Jugador, Mesa } from "../interfaces.js";
import type { DataReturn } from "../types/express.js";
export declare function crearMesa(nombreJugador: string, nombreMesa: string, mesas: Mesa[], id: string): Promise<DataReturn>;
export declare function unirseAMesa(nombreJugador: string, jugadores: Jugador[], nombreMesa: string, mesas: Mesa[], id: string): Promise<DataReturn>;
export declare function realizarDescarte(nombreJugador: string, indices: number[], nombreMesa: string, mesas: Mesa[]): DataReturn;
export declare function descartar(mesa: Mesa, jugadores: Jugador[]): {
    ok: boolean;
    msg: string;
    data: Mesa;
};
export declare function salirDeMesa(nombreJugador: string, mesas: Mesa[]): Promise<DataReturn>;
export declare function obtenerTodasLasMesas(mesas: Mesa[]): Promise<Mesa[]>;
export declare function buscarMesaDeJugador(nombreJugador: string, mesas: Mesa[]): {
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
export declare function obtenerMesasLobby(): Promise<(import("mongoose").Document<unknown, {}, {
    jugadores: import("mongoose").Types.DocumentArray<{
        cartas: import("mongoose").Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        mesaID?: string | null;
        listoParaDescartar?: boolean | null;
        puntosGlobales?: number | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        cartas: import("mongoose").Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        mesaID?: string | null;
        listoParaDescartar?: boolean | null;
        puntosGlobales?: number | null;
    }> & {
        cartas: import("mongoose").Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        mesaID?: string | null;
        listoParaDescartar?: boolean | null;
        puntosGlobales?: number | null;
    }>;
    mazo: import("mongoose").Types.DocumentArray<{
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }> & {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }>;
    cartasPorRonda: import("mongoose").Types.DocumentArray<{
        nombre?: string | null;
        carta?: {
            palo?: string | null;
            numero?: number | null;
        } | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        nombre?: string | null;
        carta?: {
            palo?: string | null;
            numero?: number | null;
        } | null;
    }> & {
        nombre?: string | null;
        carta?: {
            palo?: string | null;
            numero?: number | null;
        } | null;
    }>;
    ganadoresRonda: string[];
    estado?: string | null;
    fase?: string | null;
    triunfo?: string | null;
    turnoActual?: number | null;
    repartidor?: number | null;
    ronda?: number | null;
    nombre?: string | null;
    inicioRonda?: number | null;
}, {}, import("mongoose").DefaultSchemaOptions> & {
    jugadores: import("mongoose").Types.DocumentArray<{
        cartas: import("mongoose").Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        mesaID?: string | null;
        listoParaDescartar?: boolean | null;
        puntosGlobales?: number | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        cartas: import("mongoose").Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        mesaID?: string | null;
        listoParaDescartar?: boolean | null;
        puntosGlobales?: number | null;
    }> & {
        cartas: import("mongoose").Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        mesaID?: string | null;
        listoParaDescartar?: boolean | null;
        puntosGlobales?: number | null;
    }>;
    mazo: import("mongoose").Types.DocumentArray<{
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }> & {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }>;
    cartasPorRonda: import("mongoose").Types.DocumentArray<{
        nombre?: string | null;
        carta?: {
            palo?: string | null;
            numero?: number | null;
        } | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        nombre?: string | null;
        carta?: {
            palo?: string | null;
            numero?: number | null;
        } | null;
    }> & {
        nombre?: string | null;
        carta?: {
            palo?: string | null;
            numero?: number | null;
        } | null;
    }>;
    ganadoresRonda: string[];
    estado?: string | null;
    fase?: string | null;
    triunfo?: string | null;
    turnoActual?: number | null;
    repartidor?: number | null;
    ronda?: number | null;
    nombre?: string | null;
    inicioRonda?: number | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
})[]>;
export declare function obtenerMesaDeJuego(nombreMesa: string): Promise<{
    ok: boolean;
    msg: string;
    data?: never;
} | {
    ok: boolean;
    msg: string;
    data: import("mongoose").Document<unknown, {}, {
        jugadores: import("mongoose").Types.DocumentArray<{
            cartas: import("mongoose").Types.DocumentArray<{
                palo?: string | null;
                numero?: number | null;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                palo?: string | null;
                numero?: number | null;
            }> & {
                palo?: string | null;
                numero?: number | null;
            }>;
            descarte: number[];
            nombre?: string | null;
            puntos?: number | null;
            posicionMesa?: number | null;
            ready?: boolean | null;
            mesaID?: string | null;
            listoParaDescartar?: boolean | null;
            puntosGlobales?: number | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            cartas: import("mongoose").Types.DocumentArray<{
                palo?: string | null;
                numero?: number | null;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                palo?: string | null;
                numero?: number | null;
            }> & {
                palo?: string | null;
                numero?: number | null;
            }>;
            descarte: number[];
            nombre?: string | null;
            puntos?: number | null;
            posicionMesa?: number | null;
            ready?: boolean | null;
            mesaID?: string | null;
            listoParaDescartar?: boolean | null;
            puntosGlobales?: number | null;
        }> & {
            cartas: import("mongoose").Types.DocumentArray<{
                palo?: string | null;
                numero?: number | null;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                palo?: string | null;
                numero?: number | null;
            }> & {
                palo?: string | null;
                numero?: number | null;
            }>;
            descarte: number[];
            nombre?: string | null;
            puntos?: number | null;
            posicionMesa?: number | null;
            ready?: boolean | null;
            mesaID?: string | null;
            listoParaDescartar?: boolean | null;
            puntosGlobales?: number | null;
        }>;
        mazo: import("mongoose").Types.DocumentArray<{
            nombre?: string | null;
            palo?: string | null;
            numero?: number | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            nombre?: string | null;
            palo?: string | null;
            numero?: number | null;
        }> & {
            nombre?: string | null;
            palo?: string | null;
            numero?: number | null;
        }>;
        cartasPorRonda: import("mongoose").Types.DocumentArray<{
            nombre?: string | null;
            carta?: {
                palo?: string | null;
                numero?: number | null;
            } | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            nombre?: string | null;
            carta?: {
                palo?: string | null;
                numero?: number | null;
            } | null;
        }> & {
            nombre?: string | null;
            carta?: {
                palo?: string | null;
                numero?: number | null;
            } | null;
        }>;
        ganadoresRonda: string[];
        estado?: string | null;
        fase?: string | null;
        triunfo?: string | null;
        turnoActual?: number | null;
        repartidor?: number | null;
        ronda?: number | null;
        nombre?: string | null;
        inicioRonda?: number | null;
    }, {}, import("mongoose").DefaultSchemaOptions> & {
        jugadores: import("mongoose").Types.DocumentArray<{
            cartas: import("mongoose").Types.DocumentArray<{
                palo?: string | null;
                numero?: number | null;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                palo?: string | null;
                numero?: number | null;
            }> & {
                palo?: string | null;
                numero?: number | null;
            }>;
            descarte: number[];
            nombre?: string | null;
            puntos?: number | null;
            posicionMesa?: number | null;
            ready?: boolean | null;
            mesaID?: string | null;
            listoParaDescartar?: boolean | null;
            puntosGlobales?: number | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            cartas: import("mongoose").Types.DocumentArray<{
                palo?: string | null;
                numero?: number | null;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                palo?: string | null;
                numero?: number | null;
            }> & {
                palo?: string | null;
                numero?: number | null;
            }>;
            descarte: number[];
            nombre?: string | null;
            puntos?: number | null;
            posicionMesa?: number | null;
            ready?: boolean | null;
            mesaID?: string | null;
            listoParaDescartar?: boolean | null;
            puntosGlobales?: number | null;
        }> & {
            cartas: import("mongoose").Types.DocumentArray<{
                palo?: string | null;
                numero?: number | null;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                palo?: string | null;
                numero?: number | null;
            }> & {
                palo?: string | null;
                numero?: number | null;
            }>;
            descarte: number[];
            nombre?: string | null;
            puntos?: number | null;
            posicionMesa?: number | null;
            ready?: boolean | null;
            mesaID?: string | null;
            listoParaDescartar?: boolean | null;
            puntosGlobales?: number | null;
        }>;
        mazo: import("mongoose").Types.DocumentArray<{
            nombre?: string | null;
            palo?: string | null;
            numero?: number | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            nombre?: string | null;
            palo?: string | null;
            numero?: number | null;
        }> & {
            nombre?: string | null;
            palo?: string | null;
            numero?: number | null;
        }>;
        cartasPorRonda: import("mongoose").Types.DocumentArray<{
            nombre?: string | null;
            carta?: {
                palo?: string | null;
                numero?: number | null;
            } | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            nombre?: string | null;
            carta?: {
                palo?: string | null;
                numero?: number | null;
            } | null;
        }> & {
            nombre?: string | null;
            carta?: {
                palo?: string | null;
                numero?: number | null;
            } | null;
        }>;
        ganadoresRonda: string[];
        estado?: string | null;
        fase?: string | null;
        triunfo?: string | null;
        turnoActual?: number | null;
        repartidor?: number | null;
        ronda?: number | null;
        nombre?: string | null;
        inicioRonda?: number | null;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>;
//# sourceMappingURL=mesa.d.ts.map