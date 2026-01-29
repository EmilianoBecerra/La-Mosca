function obtenerFuerza (numero) {
  const fuerzas = [1, 3, 12, 11, 10, 9, 8, 7, 6, 5, 4, 2];
  const fuerza = fuerzas.findIndex(c => c === numero);
  return fuerza;
}

function determinarGanador (cartasJugadas, triunfo) {
  const fuerzas = [1, 3, 12, 11, 10, 9, 8, 7, 6, 5, 4, 2];
  const paloSalida = cartasJugadas[0].carta.palo;
  const cartasTriunfo = cartasJugadas.filter(c => c.carta.palo === triunfo).sort((a, b) => fuerzas.indexOf(a.carta.numero) - fuerzas.indexOf(b.carta.numero));
  const cartasSalida = cartasJugadas.filter(c => c.carta.palo === paloSalida).sort((a, b) => fuerzas.indexOf(a.carta.numero) - fuerzas.indexOf(b.carta.numero));

  if (cartasTriunfo.length > 0) {
    return { idGanador: cartasTriunfo[0].id, carta: { palo: cartasTriunfo[0].carta.palo, numero: cartasTriunfo[0].carta.numero } };
  } else {
    return { idGanador: cartasSalida[0].id, carta: { palo: cartasSalida[0].carta.palo, numero: cartasSalida[0].carta.numero } };
  }
}

function jugarCarta (jugador, carta, mesa) {
  const indiceCarta = jugador.cartas.findIndex(c => c.palo === carta.palo && c.numero === carta.numero);

  if (indiceCarta === -1) return;

  jugador.cartas.splice(indiceCarta, 1);
  mesa.cartasPorRonda.push({ id: jugador.id, carta });

  const numJugadores = mesa.jugadores.length;

  if (mesa.cartasPorRonda.length < numJugadores) {
    mesa.turno++;
  } else {
    mesa.turno = 0;
    mesa.estado = "determinar-ganador";
  }
}

module.exports = { obtenerFuerza, determinarGanador, jugarCarta };
