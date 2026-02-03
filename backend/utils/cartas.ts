import type { Carta, Mesa } from "../interfaces.js";

export const paloNumero = {
  palo: ["oro", "espada", "basto", "copa"],
  numeros: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}


export function crearMazo() {
  const mazo: Carta[] = [];
  for (let i = 0; i < paloNumero.palo.length; i++) {
    for (let j = 0; j < paloNumero.numeros.length; j++) {
      if (paloNumero.palo && paloNumero.numeros) {
        const palo = paloNumero.palo[i];
        const numero = paloNumero.numeros[j];
        if (palo && numero) {
          mazo.push({ palo, numero })
        }
      }
    }
  }
  return mazo;
}

export function mezclarMazo(mazo: Carta[]) {
  const copia = [...mazo];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copia[i];
    copia[i] = copia[j]!;
    copia[j] = temp!;
  }
  return copia;
}

export function repartirCartas(mesa: Mesa) {
  const numeroJugadores = mesa.jugadores.length;
  const mazo = mesa.mazo;
  mesa.jugadores.forEach(j => j.cartas = []);
  for (let c = 0; c < 5; c++) {
    for (let i = 0; i < numeroJugadores; i++) {
      const jugador = mesa.jugadores[i];
      const carta = mazo.pop();
      if (jugador?.cartas && carta) {
        jugador.cartas.push(carta);
      }
    }
  }
  const cartasRepartidor = mesa.jugadores[mesa.repartidor]?.cartas;
  if (!cartasRepartidor) throw new Error("error carta repartidor");
  const ultimaCarta = cartasRepartidor[cartasRepartidor.length - 1];
  mesa.triunfo = ultimaCarta?.palo ?? "";
}

export function descartarCartas(mesa: Mesa, nombreJugador: string) {
  const jugadores = mesa.jugadores;
  for (const jugador of jugadores) {
    const jugadorEncontrado = jugador.nombre === nombreJugador;
    if (!jugadorEncontrado) {
      continue;
    }
    const indiceCartasADescartar = jugador.descarte;
    const cartasRestantes: Carta[] | undefined = jugador.cartas?.filter((_, i) => !indiceCartasADescartar?.includes(i));
    if (cartasRestantes) {
      jugador.cartas = cartasRestantes;
    }
  }
}

export function repartirPostDescarte(mesa: Mesa) {
  const jugadoresEnLaMesa = mesa.jugadores;
  for (let i = 0; i < jugadoresEnLaMesa.length; i++) {
    const posicionJugador = (mesa.repartidor + 1 + i) % jugadoresEnLaMesa.length;
    const jugador = jugadoresEnLaMesa[posicionJugador];

    if (!jugador?.cartas) continue;

    const cartasFaltante = 5 - jugador.cartas.length;

    for (let c = 0; c < cartasFaltante; c++) {
      const carta = mesa.mazo.pop();
      if (carta) {
        jugador.cartas.push(carta);
      }
    }
  }
}
