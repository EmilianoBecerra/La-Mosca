let mesaIdCounter = 1;

function generarIdMesa () {
  return `mesa_${Date.now()}_${mesaIdCounter++}`;
}

function crearMesa (jugador, nombreMesa, mesas) {
  const mesaExistente = mesas.find(m =>
    m.jugadores.some(j => j._id.toString() === jugador._id.toString())
  );

  if (mesaExistente) {
    return { ok: false, msg: "Ya estás en una mesa", data: mesaExistente };
  }

  if (mesas.find(m => m.nombre === nombreMesa)) {
    return { ok: false, msg: "Ya existe una mesa con ese nombre" };
  }

  const nuevaMesa = {
    _id: generarIdMesa(),
    nombre: nombreMesa,
    estado: "esperando-jugadores",
    fase: "esperando-jugadores-ready",
    jugadores: [{
      _id: jugador._id,
      nombre: jugador.nombre,
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
    repartidor: 0,
    cartasPorRonda: [],
    ronda: 0
  };

  mesas.push(nuevaMesa);
  return { ok: true, msg: "Mesa creada", data: nuevaMesa };
}

function unirseAMesa (jugador, idMesa, mesas) {
  const mesaActual = mesas.find(m =>
    m.jugadores.some(j => j._id.toString() === jugador._id.toString())
  );

  if (mesaActual) {
    return { ok: false, msg: "Ya estás en una mesa", data: mesaActual };
  }

  const mesa = mesas.find(m => m._id.toString() === idMesa);

  if (!mesa) {
    return { ok: false, msg: "Mesa no encontrada" };
  }

  if (mesa.jugadores.length >= 6) {
    return { ok: false, msg: "Mesa llena" };
  }

  if (mesa.estado !== "esperando-jugadores") {
    return { ok: false, msg: "Partida ya iniciada" };
  }

  const nuevoJugador = {
    _id: jugador._id,
    nombre: jugador.nombre,
    cartas: [],
    posicionMesa: mesa.jugadores.length,
    puntos: 20,
    ready: false,
    listoParaDescartar: false,
    descarte: []
  };

  mesa.jugadores.push(nuevoJugador);
  return { ok: true, msg: "Te uniste a la mesa", data: { mesa, jugador: nuevoJugador } };
}

function buscarMesaDeJugador (jugadorId, mesas) {
  return mesas.find(m =>
    m.jugadores.some(j => j._id.toString() === jugadorId.toString())
  );
}

function obtenerMesasDisponibles (mesas) {
  return mesas.filter(m => m.estado === "esperando-jugadores" && m.jugadores.length < 6);
}

function salirDeMesa (jugadorId, mesas) {
  const mesa = mesas.find(m => m.jugadores.some(j => j._id.toString() === jugadorId));
  if (!mesa) {
    return { ok: false, msg: "no se encuentra la mesa" };
  };
  const jugador = mesa.jugadores.find(j => j._id.toString() === jugadorId);
  if (!jugador) {
    return { ok: false, msg: "no se encuentra jugador" };
  };
  if (jugador.nombre === mesa.jugadores[0].nombre) {
    return { ok: true, msg: "eliminar toda la mesa", data: mesa };
  };
  return { ok: true, msg: "eliminar jugador", data: mesa };
};

module.exports = {
  crearMesa,
  unirseAMesa,
  buscarMesaDeJugador,
  obtenerMesasDisponibles,
  salirDeMesa
};
