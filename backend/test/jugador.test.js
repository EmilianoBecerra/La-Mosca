const test = require("node:test");
const assert = require("node:assert");
const { listoParaJugar } = require("../utils/jugadores");


const jugadores = [
    {
        _id: 1,
        nombre: "emiliano"
    },
    {
        _id:2,
        nombre: "victoria"
    }
]

test("jugadorListo", () => {
    const estadoJugador = listoParaJugar(1, jugadores);
    assert.strictEqual(estadoJugador.ok, true);
    assert.strictEqual(estadoJugador.msg, "jugador-listo");
})

test("jugadorNoEncontrado", () => {
    const estadoJugador = listoParaJugar(3, jugadores);
    assert.strictEqual(estadoJugador.ok, false);
    assert.strictEqual(estadoJugador.msg, "no-existe-jugador")
})

