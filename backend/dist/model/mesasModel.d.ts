import { Schema, Types } from "mongoose";
export declare const mesaModel: import("mongoose").Model<{
    jugadores: Types.DocumentArray<{
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }> & {
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }>;
    mazo: Types.DocumentArray<{
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }> & {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }>;
    cartasPorRonda: Types.DocumentArray<{
        nombre?: string | null;
        carta?: {
            palo?: string | null;
            numero?: number | null;
        } | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
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
    nombre?: string | null;
    estado?: string | null;
    fase?: string | null;
    triunfo?: string | null;
    turnoActual?: number | null;
    repartidor?: number | null;
    ronda?: number | null;
    inicioRonda?: number | null;
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    jugadores: Types.DocumentArray<{
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }> & {
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }>;
    mazo: Types.DocumentArray<{
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }> & {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }>;
    cartasPorRonda: Types.DocumentArray<{
        nombre?: string | null;
        carta?: {
            palo?: string | null;
            numero?: number | null;
        } | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
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
    nombre?: string | null;
    estado?: string | null;
    fase?: string | null;
    triunfo?: string | null;
    turnoActual?: number | null;
    repartidor?: number | null;
    ronda?: number | null;
    inicioRonda?: number | null;
}, {}, import("mongoose").DefaultSchemaOptions> & {
    jugadores: Types.DocumentArray<{
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }> & {
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }>;
    mazo: Types.DocumentArray<{
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }> & {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }>;
    cartasPorRonda: Types.DocumentArray<{
        nombre?: string | null;
        carta?: {
            palo?: string | null;
            numero?: number | null;
        } | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
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
    nombre?: string | null;
    estado?: string | null;
    fase?: string | null;
    triunfo?: string | null;
    turnoActual?: number | null;
    repartidor?: number | null;
    ronda?: number | null;
    inicioRonda?: number | null;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    jugadores: Types.DocumentArray<{
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }> & {
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }>;
    mazo: Types.DocumentArray<{
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }> & {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }>;
    cartasPorRonda: Types.DocumentArray<{
        nombre?: string | null;
        carta?: {
            palo?: string | null;
            numero?: number | null;
        } | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
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
    nombre?: string | null;
    estado?: string | null;
    fase?: string | null;
    triunfo?: string | null;
    turnoActual?: number | null;
    repartidor?: number | null;
    ronda?: number | null;
    inicioRonda?: number | null;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    jugadores: Types.DocumentArray<{
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }> & {
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }>;
    mazo: Types.DocumentArray<{
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }> & {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }>;
    cartasPorRonda: Types.DocumentArray<{
        nombre?: string | null;
        carta?: {
            palo?: string | null;
            numero?: number | null;
        } | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
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
    nombre?: string | null;
    estado?: string | null;
    fase?: string | null;
    triunfo?: string | null;
    turnoActual?: number | null;
    repartidor?: number | null;
    ronda?: number | null;
    inicioRonda?: number | null;
}>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<{
    jugadores: Types.DocumentArray<{
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }> & {
        cartas: Types.DocumentArray<{
            palo?: string | null;
            numero?: number | null;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            palo?: string | null;
            numero?: number | null;
        }> & {
            palo?: string | null;
            numero?: number | null;
        }>;
        descarte: number[];
        nombre?: string | null;
        puntosGlobales?: number | null;
        mesaID?: string | null;
        puntos?: number | null;
        posicionMesa?: number | null;
        ready?: boolean | null;
        listoParaDescartar?: boolean | null;
    }>;
    mazo: Types.DocumentArray<{
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }> & {
        nombre?: string | null;
        palo?: string | null;
        numero?: number | null;
    }>;
    cartasPorRonda: Types.DocumentArray<{
        nombre?: string | null;
        carta?: {
            palo?: string | null;
            numero?: number | null;
        } | null;
    }, Types.Subdocument<import("bson").ObjectId, any, {
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
    nombre?: string | null;
    estado?: string | null;
    fase?: string | null;
    triunfo?: string | null;
    turnoActual?: number | null;
    repartidor?: number | null;
    ronda?: number | null;
    inicioRonda?: number | null;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=mesasModel.d.ts.map