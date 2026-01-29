const { jugadorModel } = require("../model/JugadorModel");



async function buscarJugadoresBD(id) {
    try {
        if (id) {
            const jugador = await jugadorModel.findById(id);
            if (!jugador) {
                return { ok: false, msg: "Jugador no existe" }
            }
            return { ok: true, msg: "Jugador encontrado", data: jugador };
        }
    } catch (error) {
        console.error(error)
        return { ok: false, msg: "Error en el servidor => buscarJugadoresBD", data: error.message };
    }
}

async function crearJugador(nombre, jugadores) {
    try {
        const nombreTomado = await jugadorModel.findOne({ nombre });
        if (nombreTomado) {
            return { ok: false, msg: "Ya existe un jugador con ese nombre" };
        }
        const jugador = await jugadorModel.create({ nombre, puntosGlobales: 0 });
        jugadores.push(jugador);
        return { ok: true, msg: "Jugador creado", data: jugador };
    } catch (e) {
        console.error(e);
        return { ok: false, msg: "Error al registrar usuario en base de datos." }
    }
}

function listoParaJugar(id, jugadores) {
    try {
        const jugador = jugadores.find(j => j._id.toString() === id);
        if (!jugador) {
            return { ok: false, msg: "no-existe-jugador" };
        }
        jugador.ready = true;

        return { ok: true, msg: "jugador-listo" };
    } catch (error) {
        console.error(error);
        return { ok: false, msg: "Error al cambiar de estado ready jugador." };
    }
}


module.exports = { crearJugador, buscarJugadoresBD, listoParaJugar };



