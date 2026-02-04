import { Schema, Types, model } from "mongoose";

const jugadorSchema = new Schema({
  nombre: {
    type: String,
    unique: true,
    required: true
  },
  codigo: {
    type: String,
    required: true
  },
  puntosGlobales: {
    type: Number,
    default: 0
  },
  mesaID: {
    type: Types.ObjectId,
    default: null
  },
  
});

export const jugadorModel = model("jugador", jugadorSchema);

