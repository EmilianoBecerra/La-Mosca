/* import assert from "node:assert";
import test from "node:test";
import { determinarGanador } from "../utils/partida.js";


const cartasJugadas = [
  { id: "0", carta: { palo: "espada", numero: 1 } },
  { id: "1", carta: { palo: "copa", numero: 3 } },
  { id: "2", carta: { palo: "copa", numero: 1 } },
  { id: "3", carta: { palo: "espada", numero: 7 } },
]

const triunfo = "oro";

test("determinar ganadores", () => {
  const ganador = determinarGanador(cartasJugadas, triunfo);
  assert.strictEqual(ganador, 0);
})

 */