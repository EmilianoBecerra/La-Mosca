import type { Jugador, Mesa } from "../interfaces.js";
import { mesaModel } from "../model/mesasModel.js";
import { descartarCartas, repartirPostDescarte } from "./cartas.js";

type DataReturn =
  | { ok: true, msg: string, data: { mesa?: Mesa, jugador?: Jugador } }
  | { ok: false, msg: string }

export async function crearMesa(nombreJugador: string, nombreMesa: string, mesas: Mesa[], jugadores: Jugador[]): Promise<DataReturn> {
  try {
    await obtenerTodasLasMesas(mesas);
    const mesaExistente = mesas.find(m =>
      m.jugadores.some(j => j.nombre === nombreJugador)
    );
    if (mesaExistente) {
      return { ok: true, msg: "estas-en-una-mesa", data: { mesa: mesaExistente } };
    }
    if (mesas.find(m => m.nombre === nombreMesa)) {
      return { ok: false, msg: "Ya existe una mesa con ese nombre" };
    }
    const nuevaMesa: Mesa = {
      nombre: nombreMesa,
      estado: "esperando-jugadores",
      fase: "esperando-jugadores-ready",
      jugadores: [{
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
    await mesaModel.create(nuevaMesa);
    return { ok: true, msg: "Mesa creada", data: { mesa: nuevaMesa } };
  } catch (error) {
    console.error("Error al crear la Mesa nueva");
    return { ok: false, msg: "Error al crear la Mesa nueva" }
  }
}

export async function unirseAMesa(nombreJugador: string, jugadores: Jugador[], nombreMesa: string, mesas: Mesa[]): Promise<DataReturn> {
  try {
    await obtenerTodasLasMesas(mesas);
    const mesaActual = mesas.find(m => m.nombre === nombreMesa);
    const jugador = jugadores.find(j => j.nombre === nombreJugador);

    if (!mesaActual) {
      return { ok: false, msg: `El nombre de la mesa es incorrecto ${nombreMesa}` };
    }
    if (!jugador) {
      return { ok: false, msg: `El nombre del jugador es incorrecto ${nombreJugador}` };
    }
    if (jugador.mesaID) {
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
      cartas: [],
      posicionMesa: mesaActual.jugadores.length,
      puntos: 20,
      mesaID: mesaActual.nombre,
      ready: false,
      listoParaDescartar: false,
      descarte: []
    };
    const mesaBD = await mesaModel.findById(mesaActual._id);
    if (!mesaBD) {
      return { ok: false, msg: "Mesa no encontrada en la DB" };
    };
    mesaBD.jugadores.push(nuevoJugador);
    await mesaBD.save();
    mesaActual.jugadores.push(nuevoJugador as Jugador);
    return { ok: true, msg: "Te uniste a la mesa", data: { mesa: mesaActual, jugador: nuevoJugador as Jugador } };
  } catch (e) {
    console.error("Error al agregar un jugador en la mesa");
    return { ok: false, msg: "Error interno: Falló agregar jugador a la mesa" };
  }
};

export function realizarDescarte(nombreJugador: string, indices: number[], nombreMesa: string, mesas: Mesa[]): DataReturn {
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
    return { ok: true, msg: "Jugador descartó", data: { mesa, jugador } }
  }
  return { ok: false, msg: "Faltan jugadores listos" }
}

export function descartar(mesa: Mesa, jugadores: Jugador[]) {
  for (const jugador of jugadores) {
    if (jugador.descarte) {
      if (jugador.descarte.length > 0) {
        descartarCartas(mesa, jugador.nombre);
      } else {
        continue;
      }
    }
  }
  return { ok: true, msg: "descarte realizado", data: mesa }
}

export async function salirDeMesa(nombreJugador: string, mesas: Mesa[]): Promise<DataReturn> {
  await obtenerTodasLasMesas(mesas);

  const mesa = mesas.find(m => m.jugadores.some(j => j.nombre === nombreJugador));
  if (!mesa) {
    return { ok: false, msg: "No se encuentra la mesa" };
  };
  const jugador = mesa.jugadores.find(j => j.nombre === nombreJugador);
  if (!jugador) {
    return { ok: false, msg: "no se encuentra jugador" };
  };
  if (jugador.nombre === mesa.jugadores[0]?.nombre) {
    const index = mesas.findIndex(m => m._id?.toString() === mesa._id?.toString());
    if (index !== -1) mesas.splice(index, 1);
    await mesaModel.findByIdAndDelete(mesa._id);
    return { ok: true, msg: "eliminar toda la mesa", data: { mesa } };
  };
  mesa.jugadores = mesa.jugadores.filter(j => j.nombre !== nombreJugador);
  mesa.jugadores.forEach((j, index) => {
    j.posicionMesa = index;
  })
  await mesaModel.findByIdAndUpdate(mesa._id, {
    jugadores: mesa.jugadores
  })
  return { ok: true, msg: "eliminar jugador", data: { mesa, jugador } };
};

export async function obtenerTodasLasMesas(mesas: Mesa[]) {
  const mesasDB: Mesa[] = await mesaModel.find();
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

export function buscarMesaDeJugador(nombreJugador: string, mesas: Mesa[]) {
  const mesa = mesas.find(m =>
    m.jugadores.some(j => j.nombre === nombreJugador)
  );
  const jugador = mesa?.jugadores.find(js => js.nombre === nombreJugador);
  return { mesa, jugador };
}

export function obtenerMesasDisponibles(mesas: Mesa[]) {
  return mesas.filter(m => m.estado === "esperando-jugadores" && m.jugadores.length < 4);
} 
