import { jugadorModel } from "../model/JugadorModel.js";
export async function crearJugador(nombre, codigo, jugadores, socketId) {
    try {
        const nombreSanitizado = nombre.toLocaleLowerCase();
        const nombreExiste = await jugadorModel.findOne({ nombre: nombreSanitizado });
        if (nombreExiste && codigo === nombreExiste.codigo) {
            jugadores.push({ nombre: nombreSanitizado, socketId });
            return { ok: true, msg: "Jugador recuperado", data: { nombre: nombreSanitizado } };
        }
        if (nombreExiste && codigo !== nombreExiste.codigo) {
            return { ok: false, msg: "Ya existe un jugador con ese nombre" };
        }
        const jugadorBD = await jugadorModel.create({ nombre: nombreSanitizado, codigo });
        const jugador = {
            nombre: jugadorBD.nombre,
            socketId
        };
        if (!jugadores.find(j => j.nombre === nombreSanitizado)) {
            jugadores.push(jugador);
        }
        return { ok: true, msg: "Jugador Creado", data: jugador };
    }
    catch (e) {
        console.error(e);
        return { ok: false, msg: "Error al registrar usuario en base de datos." };
    }
}
export async function loginJugador(nombre, codigo, jugadores, socketId) {
    try {
        const nombreSanitizado = nombre.toLocaleLowerCase();
        const jugadorDB = await jugadorModel.findOne({ nombre: nombreSanitizado });
        if (!jugadorDB) {
            return { ok: false, msg: "Jugador no existe" };
        }
        ;
        if (jugadorDB.nombre === nombre && jugadorDB.codigo !== codigo) {
            return { ok: false, msg: "Codigo incorrecto o jugador no existe." };
        }
        ;
        let jugador;
        if (jugadores.find(j => j.nombre === jugadorDB.nombre)) {
            return { ok: false, msg: "Jugador ya conectado" };
        }
        if (!jugadorDB.mesaID) {
            jugador = {
                nombre: jugadorDB.nombre,
                puntosGlobales: jugadorDB.puntosGlobales,
                socketId
            };
            if (!jugadores.find(j => j.nombre === nombre)) {
                jugadores.push(jugador);
            }
            return { ok: true, msg: "Jugador identificado", data: jugador };
        }
        jugador = {
            nombre: jugadorDB.nombre,
            mesaID: jugadorDB.mesaID.toString(),
            puntosGlobales: jugadorDB.puntosGlobales,
            socketId
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
export function Logout(nombre, jugadores) {
    const nombreSanitizado = nombre.toLocaleLowerCase();
    const jugador = jugadores.findIndex(j => j.nombre.toLocaleLowerCase() === nombreSanitizado);
    if (jugador === -1) {
        return { ok: false, msg: "El jugador ya está desconectado" };
    }
    const seQuitoJugador = jugadores.splice(jugador, 1);
    return { ok: true, msg: "Sesión cerrada con éxito", data: seQuitoJugador };
}
//# sourceMappingURL=jugadores.js.map