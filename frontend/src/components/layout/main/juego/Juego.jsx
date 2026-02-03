import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../../context/GlobalContext";
import "./Juego.css";
import { Buttons } from "../../../parts/Buttons";

const ICONOS_PALO = {
    oro: "🪙",
    espada: "⚔️",
    basto: "🪵",
    copa: "🏆"
};

export function Juego() {
    const { mesa, nombreJugador, descartarCartas, jugarCarta, rondaActual, resultadoRonda, salirMesa } = useContext(GlobalContext);
    const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);

    useEffect(() => {
        if (!mesa) return;
        // Limpiar selección cuando comienza la partida o cambian las cartas (nueva mano)
        if (mesa.estado === "en-partida") {
            setCartasSeleccionadas([]);
        }
    }, [mesa?.estado, mesa?.ronda]);

    if (!mesa) return null;

    const miJugador = mesa.jugadores.find(j => j.nombre === nombreJugador);
    const otrosJugadores = mesa.jugadores.filter(j => j.nombre !== nombreJugador);

    const numeroJugadores = mesa.jugadores.length;
    const inicioRonda = mesa.inicioRonda ?? ((mesa.repartidor + 1) % numeroJugadores);
    const turnoIndex = (inicioRonda + mesa.turnoActual) % numeroJugadores;
    const jugadorEnTurno = mesa.jugadores[turnoIndex];
    const esMiTurno = jugadorEnTurno?._id?.toString() === miJugador?._id?.toString();

    const esDescarte = mesa.estado === "descarte";
    const esPartida = mesa.estado === "en-partida";

    const toggleCarta = (index) => {
        if (esPartida) return;
        if (cartasSeleccionadas.includes(index)) {
            setCartasSeleccionadas(cartasSeleccionadas.filter(i => i !== index));
        } else {
            setCartasSeleccionadas([...cartasSeleccionadas, index]);
        }
    };

    const handleDescartar = () => {
        descartarCartas(cartasSeleccionadas);
        // No limpiamos aquí para que queden seleccionadas visualmente mientras espera
    };

    const handleJugarCarta = (carta) => {
        if (!esPartida || !esMiTurno || resultadoRonda) return;
        jugarCarta(carta);
    };

    return (
        <div className="juego-container">
            <div className="info-mesa">
                <div className="info-left">
                    <h2>{mesa.nombre}</h2>
                    <span className="ronda-info">Ronda {mesa.ronda + 1}</span>
                </div>
                <div className="triunfo">
                    <span>Triunfo:</span>
                    <span className={`palo-badge ${mesa.triunfo?.toLowerCase()}`}>
                        {ICONOS_PALO[mesa.triunfo?.toLowerCase()]} {mesa.triunfo}
                    </span>
                </div>
                <div className="fase-badge">
                    {esDescarte ? "Fase de Descarte" : "En Partida"}
                </div>
                <button className="btn-abandonar" onClick={salirMesa}>
                    Abandonar
                </button>
            </div>

            <div className="area-juego">
                <div className="otros-jugadores">
                    {otrosJugadores.map((jugador) => {
                        const esElTurno = jugador._id?.toString() === jugadorEnTurno?._id?.toString();
                        return (
                            <div
                                key={jugador.id}
                                className={`jugador-rival ${esElTurno ? 'turno-activo' : ''}`}
                            >
                                <div className="avatar">
                                    {esElTurno && <span className="turno-indicator">▶</span>}
                                    👤
                                </div>
                                <span className="nombre">{jugador.nombre}</span>
                                <div className="jugador-stats">
                                    <span className="cartas-count">🃏 {jugador.cartas?.length || 0}</span>
                                    <span className="puntos">{jugador.puntos} pts</span>
                                </div>
                                {esDescarte && jugador.listoParaDescartar && (
                                    <span className="listo-badge">Listo</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="tablero-centro">
                    {resultadoRonda ? (
                        <div className="resultado-ronda">
                            <div className="resultado-ronda-content">
                                <span className="resultado-icon">🏆</span>
                                <h4>¡{resultadoRonda.ganador} gana la ronda!</h4>
                                <div className="cartas-ronda-resultado">
                                    {resultadoRonda.cartasJugadas?.map((jugada, idx) => {
                                        const esGanadora = jugada.carta.numero === resultadoRonda.cartaGanadora?.numero &&
                                            jugada.carta.palo === resultadoRonda.cartaGanadora?.palo;
                                        return (
                                            <div key={idx} className="carta-jugada-resultado">
                                                <span className="jugador-nombre-resultado">
                                                    {jugada.nombre}
                                                </span>
                                                <div className={`carta ${jugada.carta.palo.toLowerCase()} ${esGanadora ? 'carta-ganadora' : ''}`}>
                                                    <span className="numero">{jugada.carta.numero}</span>
                                                    <span className="palo-icon">
                                                        {ICONOS_PALO[jugada.carta.palo.toLowerCase()]}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : rondaActual.length > 0 ? (
                        <div className="ronda-actual">
                            <h4>Ronda Actual</h4>
                            <div className="cartas-ronda">
                                {rondaActual.map((jugada, idx) => (
                                    <div key={idx} className="carta-jugada-container">
                                        <span className="jugador-nombre-ronda">
                                            {jugada.nombre}
                                        </span>
                                        <div className={`carta ${jugada.carta.palo.toLowerCase()}`}>
                                            <span className="numero">{jugada.carta.numero}</span>
                                            <span className="palo-icon">
                                                {ICONOS_PALO[jugada.carta.palo.toLowerCase()]}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="esperando-jugadas">
                            {esDescarte ? (
                                <p>Selecciona las cartas que deseas descartar</p>
                            ) : esPartida ? (
                                <p>{esMiTurno ? "¡Es tu turno! Haz clic en una carta para jugarla" : `Esperando a ${jugadorEnTurno?.nombre}...`}</p>
                            ) : (
                                <p>Esperando...</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="mis-cartas-area">
                    <div className="mi-info">
                        <h3>{miJugador?.nombre}</h3>
                        <span className="mis-puntos">{miJugador?.puntos} puntos</span>
                        {esMiTurno && esPartida && <span className="mi-turno-badge">Tu turno</span>}
                    </div>

                    <div className="mano">
                        {miJugador?.cartas?.map((carta, index) => (
                            <div
                                key={index}
                                className={`carta ${carta.palo.toLowerCase()} ${cartasSeleccionadas.includes(index) ? 'seleccionada' : ''} ${esPartida && esMiTurno && !resultadoRonda ? 'jugable' : ''}`}
                                onClick={() => esDescarte ? toggleCarta(index) : handleJugarCarta(carta)}
                            >
                                <span className="numero">{carta.numero}</span>
                                <span className="palo-icon">{ICONOS_PALO[carta.palo.toLowerCase()]}</span>
                            </div>
                        ))}
                    </div>

                    <div className="acciones">
                        {esDescarte && (
                            miJugador?.listoParaDescartar ? (
                                <p className="estado-espera">Esperando descarte de otros jugadores...</p>
                            ) : (
                                <Buttons
                                    type="button"
                                    label={cartasSeleccionadas.length > 0 ? `Descartar (${cartasSeleccionadas.length})` : "No descartar"}
                                    onClick={handleDescartar}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
