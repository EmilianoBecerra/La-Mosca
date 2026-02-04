import { useContext } from "react";
import { GlobalContext } from "../../../../context/GlobalContext";
import { Buttons } from "../../../parts/Buttons";
import "./FinPartida.css";

export function FinPartida() {
    const { finPartida, setEstadoPantalla, setFinPartida, salirMesa, nombreJugador } = useContext(GlobalContext);

    if (!finPartida) return null;

    const esGanador = finPartida.ganador === nombreJugador;
    const jugadoresOrdenados = [...finPartida.jugadores].sort((a, b) => a.puntos - b.puntos);

    const handleSalir = () => {
        salirMesa();
        setFinPartida(null);
        setEstadoPantalla("lobby");
    };

    return (
        <div className="fin-partida-container">
            <div className="fin-partida-card">
                <div className={`resultado-header ${esGanador ? 'ganador' : 'perdedor'}`}>
                    <span className="resultado-emoji">
                        {esGanador ? '🏆' : '🎮'}
                    </span>
                    <h1>{esGanador ? '¡Ganaste!' : 'Fin de la Partida'}</h1>
                    <p className="ganador-nombre">
                        {esGanador ? '¡Felicitaciones!' : `Ganador: ${finPartida.ganador}`}
                    </p>
                </div>

                <div className="clasificacion">
                    <h3>Resumen de la Partida</h3>
                    <div className="jugadores-list">
                        {jugadoresOrdenados.map((jugador, index) => (
                            <div
                                key={jugador.nombre}
                                className={`jugador-row ${jugador.nombre === nombreJugador ? 'yo' : ''} ${jugador.nombre === finPartida.ganador ? 'ganador' : ''}`}
                            >
                                <span className="posicion">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                                </span>
                                <span className="nombre">
                                    {jugador.nombre}
                                    {jugador.nombre === nombreJugador && ' (Tu)'}
                                </span>
                                <span className="puntos">{jugador.puntos} pts</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="fin-actions">
                    <Buttons
                        label="Salir"
                        onClick={handleSalir}
                    />
                </div>
            </div>
        </div>
    );
}
