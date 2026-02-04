import type { PuntosGlobales } from "../interfaces.js";
import { jugadorModel } from "../model/JugadorModel.js";



export async function devolverJugadoresRanking() {
  const jugadores = await jugadorModel.find();
  const nombreYPuntosJugadores: PuntosGlobales[] = jugadores.map(j => {
    return {
      jugador: j.nombre,
      puntos: j.puntosGlobales
    }
  })
  if (!nombreYPuntosJugadores) {
    return { ok: false, msg: "Error al devolver puntos jugadores" }
  }
  return {ok: true, msg:"Puntos y jugadores que existen", data: nombreYPuntosJugadores}
}