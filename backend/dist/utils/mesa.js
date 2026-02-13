import { mesaModel } from "../model/mesasModel.js";
import { descartarCartas } from "./cartas.js";
export async function crearMesa(nombreJugador, nombreMesa, mesas, id) {
    try {
        await obtenerTodasLasMesas(mesas);
    }
    catch (error) {
        console.error("Error al obtener las mesas de la DB");
        return { ok: false, msg: "Error al obtener las mesas de la DB" };
    }
    const mesaExistente = mesas.find(m => m.jugadores.some(j => j.nombre === nombreJugador));
    if (mesaExistente) {
        return { ok: true, msg: "estas-en-una-mesa", data: { mesa: mesaExistente } };
    }
    if (mesas.find(m => m.nombre === nombreMesa)) {
        return { ok: false, msg: "Ya existe una mesa con ese nombre" };
    }
    const nuevaMesa = {
        nombre: nombreMesa,
        estado: "esperando-jugadores",
        fase: "esperando-jugadores-ready",
        jugadores: [{
                windowId: id,
                nombre: nombreJugador,
                mesaID: nombreMesa,
                cartas: [],
                posicionMesa: 0,
                puntos: 20,
                ready: false,
                listoParaDescartar: false,
                descarte: []
            }],
        mazo: [],
        triunfo: "",
        turnoActual: 0,
        inicioRonda: undefined,
        repartidor: 0,
        cartasPorRonda: [],
        ganadoresRonda: [],
        ronda: 0
    };
    try {
        await mesaModel.create(nuevaMesa);
    }
    catch (error) {
        console.error("Error al crear la mesa BD");
        return { ok: false, msg: "Error al crear la mesa BD" };
    }
    return { ok: true, msg: "Mesa creada", data: { mesa: nuevaMesa } };
}
export async function unirseAMesa(nombreJugador, jugadores, nombreMesa, mesas, id) {
    try {
        await obtenerTodasLasMesas(mesas);
    }
    catch (error) {
        console.error("Error al obtener las mesas de la BD");
        return { ok: false, msg: "Error al obtener las mesas de la BD" };
    }
    const mesaActual = mesas.find(m => m.nombre === nombreMesa);
    const jugador = jugadores.find(j => j.nombre === nombreJugador);
    if (!mesaActual) {
        return { ok: false, msg: `El nombre de la mesa es incorrecto ${nombreMesa}` };
    }
    if (!jugador) {
        return { ok: false, msg: `El nombre del jugador es incorrecto ${nombreJugador}` };
    }
    if (jugador.mesaID && mesaActual.nombre !== jugador.mesaID) {
        const mesa = mesas.find(m => m.nombre === jugador.mesaID);
        if (mesa) {
            return { ok: true, msg: "ya-en-mesa", data: { mesa, jugador } };
        }
    }
    if (mesaActual.jugadores.length === 4) {
        return { ok: false, msg: "La mesa está llena" };
    }
    const jugadorEnMesa = mesaActual.jugadores.find(j => j.nombre === nombreJugador);
    if (jugadorEnMesa) {
        return { ok: true, msg: "ya-en-estaMesa", data: { mesa: mesaActual, jugador: jugadorEnMesa } };
    }
    if (mesaActual.estado !== "esperando-jugadores" && !jugadorEnMesa) {
        return { ok: false, msg: "Partida ya iniciada" };
    }
    const nuevoJugador = {
        nombre: jugador.nombre,
        windowId: id,
        cartas: [],
        posicionMesa: mesaActual.jugadores.length,
        puntos: 20,
        mesaID: mesaActual.nombre,
        ready: false,
        listoParaDescartar: false,
        descarte: []
    };
    try {
        const mesaBD = await mesaModel.findById(mesaActual._id);
        if (mesaBD !== null) {
            mesaBD.jugadores.push(nuevoJugador);
            await mesaBD.save();
        }
        else {
            return { ok: false, msg: "Error al obtener la mesa de la BD" };
        }
    }
    catch (error) {
        console.error("Error al obtener la mesa de la BD");
        return { ok: false, msg: "Error al obtener la mesa de la BD" };
    }
    mesaActual.jugadores.push(nuevoJugador);
    return { ok: true, msg: "Te uniste a la mesa", data: { mesa: mesaActual, jugador: nuevoJugador } };
}
;
export function realizarDescarte(nombreJugador, indices, nombreMesa, mesas) {
    const mesa = mesas.find(m => m.nombre === nombreMesa);
    if (!mesa) {
        return { ok: false, msg: "Error al encontrar la mesa" };
    }
    const jugador = mesa.jugadores.find(j => j.nombre === nombreJugador);
    if (!jugador) {
        return { ok: false, msg: "Error al encontrar al jugador" };
    }
    if (jugador.listoParaDescartar === false) {
        jugador.descarte = indices;
        jugador.listoParaDescartar = true;
        return { ok: true, msg: "Jugador descartó", data: { mesa, jugador } };
    }
    return { ok: false, msg: "Faltan jugadores listos" };
}
export function descartar(mesa, jugadores) {
    for (const jugador of jugadores) {
        if (jugador.descarte) {
            if (jugador.descarte.length > 0) {
                descartarCartas(mesa, jugador.nombre);
            }
            else {
                continue;
            }
        }
    }
    return { ok: true, msg: "descarte realizado", data: mesa };
}
export async function salirDeMesa(nombreJugador, mesas) {
    try {
        await obtenerTodasLasMesas(mesas);
    }
    catch (error) {
        console.error("Error al obtener las mesas de la BD");
        return { ok: false, msg: "Error al obtener las mesas de la BD" };
    }
    const mesa = mesas.find(m => m.jugadores.some(j => j.nombre === nombreJugador));
    if (!mesa) {
        return { ok: false, msg: "No se encuentra la mesa" };
    }
    ;
    const jugador = mesa.jugadores.find(j => j.nombre === nombreJugador);
    if (!jugador) {
        return { ok: false, msg: "no se encuentra jugador" };
    }
    ;
    if (jugador.nombre === mesa.jugadores[0]?.nombre) {
        const index = mesas.findIndex(m => m._id?.toString() === mesa._id?.toString());
        if (index !== -1)
            mesas.splice(index, 1);
        await mesaModel.findByIdAndDelete(mesa._id);
        return { ok: true, msg: "eliminar toda la mesa", data: { mesa } };
    }
    ;
    mesa.jugadores = mesa.jugadores.filter(j => j.nombre !== nombreJugador);
    mesa.jugadores.forEach((j, index) => {
        j.posicionMesa = index;
    });
    try {
        await mesaModel.findByIdAndUpdate(mesa._id, {
            jugadores: mesa.jugadores
        });
    }
    catch (error) {
        console.error("Error al actualizar la mesa de la BD");
        return { ok: false, msg: "Error al actualizar la mesa de la BD" };
    }
    return { ok: true, msg: "eliminar jugador", data: { mesa, jugador } };
}
;
export async function obtenerTodasLasMesas(mesas) {
    try {
        const mesasDB = await mesaModel.find();
        const nombresDB = new Set(mesasDB.map(m => m.nombre));
        for (let i = mesas.length - 1; i >= 0; i--) {
            const mesaActual = mesas[i];
            if (mesaActual && !nombresDB.has(mesaActual.nombre)) {
                mesas.splice(i, 1);
            }
        }
        const nombresServidor = new Set(mesas.map(m => m.nombre));
        for (const mesa of mesasDB) {
            if (!nombresServidor.has(mesa.nombre)) {
                mesas.push(mesa);
            }
        }
        return mesas;
    }
    catch (error) {
        console.error("Error al obtener las mesas de la BD");
        throw new Error("Error al sincronizar las mesas");
    }
}
export function buscarMesaDeJugador(nombreJugador, mesas) {
    const mesa = mesas.find(m => m.jugadores.some(j => j.nombre === nombreJugador));
    if (!mesa) {
        return { ok: false, msg: "No se encuentra la mesa del jugador" };
    }
    const jugador = mesa.jugadores.find(js => js.nombre === nombreJugador);
    if (!jugador) {
        return { ok: false, msg: "No se encuentra al jugador" };
    }
    return { ok: true, msg: "Mesa encontrada", data: { mesa, jugador } };
}
export async function obtenerMesasLobby() {
    const mesasLobby = mesaModel.find().select("nombre estado jugadores.nombre jugadores.puntos");
    return mesasLobby;
}
;
export async function obtenerMesaDeJuego(nombreMesa) {
    const mesaCompleta = await mesaModel.findOne({ nombre: nombreMesa });
    if (!mesaCompleta) {
        return { ok: false, msg: "No se encuentra la mesa" };
    }
    return { ok: true, msg: "Mesa encontrada", data: mesaCompleta };
}
;
//# sourceMappingURL=mesa.js.map