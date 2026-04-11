import { Schema, Types, model } from "mongoose";
const jugadorSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    nombre: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        default: null
    },
    puntosGlobales: {
        type: Number,
        default: 0
    },
    mesaID: {
        type: Types.ObjectId,
        default: null
    }
});
export const jugadorModel = model("jugador", jugadorSchema);
//# sourceMappingURL=JugadorModel.js.map