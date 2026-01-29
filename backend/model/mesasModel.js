const { Schema, model } = require("mongoose");

const mesasSchema = new Schema({
    id: String,
    nombre: {
        type: String,
        unique: true
    },
    mazo: Array,
    triunfo: String,
    estado: String,
    fase: String,
    turnoActual: Number,
    repartidor: Number,
    cartasPorRonda: Array,
    ronda: Number,
    jugadores: Array
})

const mesaModel = model("mesa", mesasSchema);
module.exports = { mesaModel };