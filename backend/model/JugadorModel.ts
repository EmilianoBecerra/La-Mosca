import { Schema, Types, model, type Document } from "mongoose";

export interface IJugador extends Document {
  email: string;
  nombre: string;
  password?: string;
  googleId?: string;
  puntosGlobales: number;
  mesaID?: Types.ObjectId;
}

const jugadorSchema = new Schema<IJugador>({
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

export const jugadorModel = model<IJugador>( "jugador", jugadorSchema );
