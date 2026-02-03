import type { Carta, Jugador, Mesa } from "../interfaces.js";

export function determinarGanador(cartasJugadas: { nombre: string, carta: Carta }[], triunfo: string) {
  const fuerzas = [1, 3, 12, 11, 10, 9, 8, 7, 6, 5, 4, 2];
  const paloSalida = cartasJugadas[0]?.carta.palo;
  const cartasTriunfo = cartasJugadas.filter(c => c.carta.palo === triunfo).sort((a, b) => fuerzas.indexOf(a.carta.numero) - fuerzas.indexOf(b.carta.numero));
  const cartasSalida = cartasJugadas.filter(c => c.carta.palo === paloSalida).sort((a, b) => fuerzas.indexOf(a.carta.numero) - fuerzas.indexOf(b.carta.numero));

  if (cartasTriunfo.length > 0) {
    return { nombreGanador: cartasTriunfo[0]?.nombre, carta: { palo: cartasTriunfo[0]?.carta.palo, numero: cartasTriunfo[0]?.carta.numero } };
  } else {
    return { nombreGanador: cartasSalida[0]?.nombre, carta: { palo: cartasSalida[0]?.carta.palo, numero: cartasSalida[0]?.carta.numero } };
  }
}

export function juegaCarta(nombreJugador: string, carta: Carta, nombreMesa: string, mesas: Mesa[]) {
  const mesa = mesas.find(m => m.nombre === nombreMesa);
  if (!mesa) {
    return { ok: false, msg: "Mesa no encontrada" };
  };

  if (mesa.estado !== "en-partida") {
    return { ok: false, msg: "No está en partida" };
  };

  const numeroJugadores = mesa.jugadores.length;
  const inicioRonda = mesa.inicioRonda ?? mesa.repartidor + 1;
  const turnoJugador = (inicioRonda + mesa.turnoActual) % numeroJugadores;

  if (mesa.jugadores[turnoJugador]?.nombre !== nombreJugador) {
    return {ok: false, msg: "no es turno del jugador"};
  };

  const jugador = mesa.jugadores[turnoJugador];
  const indiceCarta = jugador?.cartas?.findIndex(
    c => c.palo === carta.palo && c.numero === carta.numero
  );

  if (indiceCarta === undefined || indiceCarta === -1) {
    return {ok: false, msg: "No existe carta"};
  };

  jugador?.cartas?.splice(indiceCarta, 1);

  mesa.cartasPorRonda.push({ nombre: nombreJugador, carta });
  return {ok: true, msg:"Jugó carta", data: {mesa, jugador}};
}

