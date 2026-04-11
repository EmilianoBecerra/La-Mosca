import { Types, type Document } from "mongoose";
export interface IJugador extends Document {
    email: string;
    nombre: string;
    password?: string;
    googleId?: string;
    puntosGlobales: number;
    mesaID?: Types.ObjectId;
}
export declare const jugadorModel: import("mongoose").Model<IJugador, {}, {}, {}, Document<unknown, {}, IJugador, {}, {}> & IJugador & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=JugadorModel.d.ts.map