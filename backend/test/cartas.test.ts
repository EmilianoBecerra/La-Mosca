/* import type { Carta } from "../interfaces.js";

const test = require("node:test");
const assert = require("node:assert");
const { crearMazo, mezclarMazo, repartirCartas, descartarCartas, repartirPostDescarte } = require("../utils/cartas.js");

test("crearMazo devuelve 48 cartas", () => {
  const mazo = crearMazo();
  assert.strictEqual(mazo.length, 48);
})

test("no hay cartas repetidas", () => {
  const mazo = crearMazo();
  const cartasComoStrings = mazo.map((carta: { palo: string, numero: number }) => `${carta.palo}-${carta.numero}`);
  const sinDuplicados = new Set(cartasComoStrings);
  assert.strictEqual(sinDuplicados.size, 48);
})

test("doce numeros por palo", () => {
  const mazo = crearMazo();
  const palos = ["oro", "espada", "basto", "copa"];
  const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  for (const palo of palos) {
    const cartaDelPalo = mazo.filter((carta: { palo: string, numero: number }) => carta.palo === palo);
    const filtrarPorNumero = cartaDelPalo.map((carta: { palo: string, numero: number }) => carta.numero);
    assert.deepStrictEqual(filtrarPorNumero.sort((a: number, b: number) => a - b), numeros);
  }
})

test("mezclarMazo devuelve 48 cartas", () => {
  const mazo = crearMazo();
  const mazoMezclado = mezclarMazo(mazo);
  assert.strictEqual(mazoMezclado.length, 48);
})

test("Mezclo correctamente", () => {
  const mazo = crearMazo();
  const mazoMezclado = mezclarMazo(mazo);
  const original = mazo.map((c: Carta) => `${c.palo}-${c.numero}`);
  const mezclado = mazoMezclado.map((c: Carta) => `${c.palo}-${c.numero}`)
  assert.notDeepStrictEqual(original, mezclado);
})

test("Repartir cartas", () => {
  const mesa1 = {
    jugadores: [{
      id: 0,
      cartas: [],
      posicionMesa: 0,
    },
    {
      id: 1,
      cartas: [],
      posicionMesa: 1,
    },
    {
      id: 2,
      cartas: [],
      posicionMesa: 2,
    }],
    mazo: [],
    triunfo: "",
    ronda: 0,
    turnoActual: 0,
    repartidor: 0
  }

  const mazoMezclado = mezclarMazo(crearMazo());
  mesa1.mazo = mazoMezclado;

  repartirCartas(mesa1);

  for (const jugador of mesa1.jugadores) {
    const numeroDeCartas = jugador.cartas.length;
    assert.strictEqual(numeroDeCartas, 5);
  }
  assert.strictEqual(mesa1.mazo.length, 48 - (5 * mesa1.jugadores.length));
})

test("descartas cartas", () => {
  const mesa1 = {
    jugadores: [{
      id: 0,
      cartas: [],
      posicionMesa: 0,
    },
    {
      id: 1,
      cartas: [],
      posicionMesa: 1,
    },
    {
      id: 2,
      cartas: [],
      posicionMesa: 2,
    }],
    mazo: [],
    triunfo: "",
    ronda: 0,
    turnoActual: 0,
    repartidor: 0
  }

  const mazoMezclado = mezclarMazo(crearMazo());
  mesa1.mazo = mazoMezclado;

  repartirCartas(mesa1);

  const arrayJugadores = [
    { id: 0, indices: [0, 2, 4] },
    { id: 2, indices: [1, 2] }
  ]

  descartarCartas(mesa1, arrayJugadores);

  for (const jugador of mesa1.jugadores) {
    const buscadorJugador = arrayJugadores.find(j => j.id === jugador.id);
    if (!buscadorJugador) {
      continue;
    }
    const cartasDescartadas = buscadorJugador.indices.length;
    assert.deepStrictEqual(5 - cartasDescartadas, jugador.cartas.length);
  }
  const jugador1 = mesa1.jugadores.find(j => j.id === 1);
  assert.strictEqual(jugador1?.cartas.length, 5);
})


test("repartir cartas post descarte", () => {
  const mesa1 = {
    jugadores: [{
      id: 0,
      cartas: [],
      posicionMesa: 0,
    },
    {
      id: 1,
      cartas: [],
      posicionMesa: 1,
    },
    {
      id: 2,
      cartas: [],
      posicionMesa: 2,
    }],
    mazo: [],
    triunfo: "",
    ronda: 0,
    turnoActual: 0,
    repartidor: 0
  }

  const mazoMezclado = mezclarMazo(crearMazo());
  mesa1.mazo = mazoMezclado;

  repartirCartas(mesa1);

  const arrayJugadores = [
    { id: 0, indices: [0, 2, 4] },
    { id: 2, indices: [1, 2] }
  ]

  descartarCartas(mesa1, arrayJugadores);

  repartirPostDescarte(mesa1);

  for (const jugador of mesa1.jugadores) {
    assert.deepStrictEqual(jugador.cartas.length, 5);
  }
})

 */