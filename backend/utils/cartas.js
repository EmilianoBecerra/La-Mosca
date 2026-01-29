const paloNumero = {
    palo: ["oro", "espada", "basto", "copa"],
    numeros: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}

function crearMazo() {
    const mazo = [];
    for (let i = 0; i < paloNumero.palo.length; i++) {
        for (let j = 0; j < paloNumero.numeros.length; j++) {
            mazo.push({ palo: paloNumero.palo[i], numero: paloNumero.numeros[j] })
        }
    }
    return mazo;
}

function mezclarMazo(mazo) {
    const copia = [...mazo];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function repartirCartas(mesa) {
    const numeroJugadores = mesa.jugadores.length;
    let triunfo;
    const mazo = mesa.mazo;
    mesa.jugadores.forEach(j => j.cartas = []);
    for (let c = 0; c < 5; c++) {
        for (let i = 0; i < numeroJugadores; i++) {
            const carta = mazo.pop();
            mesa.jugadores[i].cartas.push(carta);
        }
    }
    const cartasRepartidor = mesa.jugadores[mesa.repartidor].cartas;
    triunfo = cartasRepartidor[cartasRepartidor.length - 1].palo;
    mesa.triunfo = triunfo;
}


function descartarCartas(mesa, idJugador) {
    const jugadores = mesa.jugadores;
    for (const jugador of jugadores) {
        const jugadorEncontrado = jugador._id.toString() === idJugador;
        if (!jugadorEncontrado) {
            continue;
        }

        const indiceCartasADescartar = jugador.descarte;
        const cartasRestantes = jugador.cartas.filter((_, i) => !indiceCartasADescartar.includes(i));
        jugador.cartas = cartasRestantes;
    }
}

function repartirPostDescarte(mesa) {

    const jugadoresEnLaMesa = mesa.jugadores;
    for (let i = 0; i < jugadoresEnLaMesa.length; i++) {

        const posicionJugador = (mesa.repartidor + 1 + i) % jugadoresEnLaMesa.length;

        const cartasFaltante = 5 - jugadoresEnLaMesa[posicionJugador].cartas.length;

        for (let c = 0; c < cartasFaltante; c++) {
            const carta = mesa.mazo.pop();
            jugadoresEnLaMesa[posicionJugador].cartas.push(carta);
        }
    }
}



module.exports = { crearMazo, mezclarMazo, repartirCartas, descartarCartas, repartirPostDescarte };