import { jugadorModel } from "../model/JugadorModel.js";
export async function crearJugador(nombre, codigo, jugadores) {
    try {
        const nombreExiste = await jugadorModel.findOne({ nombre });
        if (nombreExiste && codigo === nombreExiste.codigo) {
            jugadores.push({ nombre });
            return { ok: true, msg: "Jugador recuperado", data: { nombre } };
        }
        if (nombreExiste && codigo !== nombreExiste.codigo) {
            return { ok: false, msg: "Ya existe un jugador con ese nombre" };
        }
        const jugadorBD = await jugadorModel.create({ nombre, codigo });
        if (!jugadorBD)
            throw new Error("Error crear jugador en la BD");
        const jugador = {
            nombre: jugadorBD.nombre,
        };
        if (!jugadores.find(j => j.nombre === nombre)) {
            jugadores.push(jugador);
        }
        return { ok: true, msg: "Jugador Creado", data: jugador };
    }
    catch (e) {
        console.error(e);
        return { ok: false, msg: "Error al registrar usuario en base de datos." };
    }
}
export async function loginJugador(nombre, codigo, jugadores) {
    try {
        const jugadorDB = await jugadorModel.findOne({ nombre });
        if (!jugadorDB) {
            return { ok: false, msg: "Jugador no existe" };
        }
        ;
        if (jugadorDB.nombre === nombre && jugadorDB.codigo !== codigo) {
            return { ok: false, msg: "Codigo incorrecto o jugador no existe." };
        }
        ;
        let jugador;
        if (!jugadorDB.mesaID) {
            jugador = {
                nombre: jugadorDB.nombre,
                puntosGlobales: jugadorDB.puntosGlobales
            };
            if (!jugadores.find(j => j.nombre === nombre)) {
                jugadores.push(jugador);
            }
            return { ok: true, msg: "Jugador identificado", data: jugador };
        }
        jugador = {
            nombre: jugadorDB.nombre,
            mesaID: jugadorDB.mesaID.toString(),
            puntosGlobales: jugadorDB.puntosGlobales
        };
        if (!jugadores.find(j => j.nombre === nombre)) {
            jugadores.push(jugador);
        }
        return { ok: true, msg: "Jugador-con-mesa", data: jugador };
    }
    catch (error) {
        console.error("Error en el login del jugador");
        return { ok: false, msg: "Falló login" };
    }
}
export function listoParaJugar(nombre, jugadores) {
    try {
        const jugador = jugadores.find(j => j.nombre === nombre);
        if (!jugador) {
            return { ok: false, msg: "no-existe-jugador" };
        }
        jugador.ready = true;
        return { ok: true, msg: "jugador-listo", data: jugador };
    }
    catch (error) {
        console.error(error);
        return { ok: false, msg: "Error al cambiar de estado ready jugador." };
    }
}
//# sourceMappingURL=jugadores.js.map