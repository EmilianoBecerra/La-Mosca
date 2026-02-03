/* import { crearJugador } from "../utils/jugadores.js";
import { assert, describe, expect, it, test, vi } from "vitest";
const jugadores = [{
  _id: "1",
  nombre: "pepe",
  socketID: "",
},
{
  _id: "2",
  nombre: "pepin",
  socketID: "",
}
];

const mockSocket = {
  id: "mock-socket-id-123",
  emit: vi.fn()
} as any;


test("crearJugador", async () => {
  const jugador = await crearJugador(mockSocket, "nombreTest", "codigo123", jugadores);
  assert.deepStrictEqual(jugador.data?.nombre, "nombreTest" )
})

 */
/* test("jugadorListo", () => {
  const estadoJugador = listoParaJugar("1", jugadores);
  assert.strictEqual(estadoJugador.ok, true);
  assert.strictEqual(estadoJugador.msg, "jugador-listo");
});

test("jugadorNoEncontrado", () => {
  const estadoJugador = listoParaJugar("3", jugadores);
  assert.strictEqual(estadoJugador.ok, false);
  assert.strictEqual(estadoJugador.msg, "no-existe-jugador");
});
 */