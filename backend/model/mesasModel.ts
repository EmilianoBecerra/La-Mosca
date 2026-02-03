import { Schema, model, Types } from "mongoose";


const mesasSchema = new Schema({
  nombre: {
    type: String,
    unique: true
  },
  estado: String,
  fase: String,
  jugadores: [{
    nombre: String,
    puntos: Number,
    posicionMesa: Number,
    ready: Boolean,
    mesaID: String,
    cartas: [{
      palo: String,
      numero: Number
    }],
    listoParaDescartar: Boolean,
    descarte: [Number],
    puntosGlobales: Number
  }],
  mazo: [
    {
      nombre: String,
      palo: String,
      numero: Number
    }
  ],
  triunfo: String,
  turnoActual: Number,
  repartidor: Number,
  inicioRonda: {
    type: Number,
    default: undefined
  },
  cartasPorRonda: [
    {
      nombre: String,
      carta: {
        palo: String,
        numero: Number
      }
    }
  ],
  ronda: Number
});

export const mesaModel = model("mesa", mesasSchema);
