const { Schema, model } = require("mongoose");


const jugadorSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: true
    },
    puntosGlobales: {
        type: Number,
        default: 0
    }
})

const jugadorModel = model("jugador", jugadorSchema);

module.exports = { jugadorModel }