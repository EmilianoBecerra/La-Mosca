import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../../context/GlobalContext";
import { Buttons } from "../../../parts/Buttons";
import "./FinMano.css";

export function FinMano() {
    const { mesa, nuevaMano, finalizarPartida, nombreJugador } = useContext(GlobalContext);
    const [contador, setContador] = useState(10);

    const hayGanador = mesa?.jugadores.some(j => j.puntos === 0);

    useEffect(() => {
        if (hayGanador) {
            finalizarPartida();
            return;
        }
        if (contador > 0) {
            const timer = setTimeout(() => setContador(contador - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            nuevaMano();
        }
    }, [contador, nuevaMano, hayGanador, finalizarPartida]);

    if (!mesa) return null;

    const jugadoresOrdenados = [...mesa.jugadores].sort((a, b) => a.puntos - b.puntos);

    const handleContinuar = () => {
        if (hayGanador) {
            finalizarPartida();
        } else {
            nuevaMano();
        }
    };

    return (
        <div className="fin-mano-container">
            <div className="fin-mano-card">
                <div className="fin-mano-header">
                    <span className="fin-mano-emoji">🃏</span>
                    <h1>Fin de la Mano</h1>
                </div>

                <div className="puntuacion">
                    <h3>Puntuacion Actual</h3>
                    <div className="jugadores-list">
                        {jugadoresOrdenados.map((jugador, index) => (
                            <div
                                key={jugador._id}
                                className={`jugador-row ${jugador.nombre === nombreJugador ? 'yo' : ''}`}
                            >
                                <span className="posicion">{index + 1}.</span>
                                <span className="nombre">
                                    {jugador.nombre}
                                    {jugador.nombre === nombreJugador && ' (Tu)'}
                                </span>
                                <span className="puntos">{jugador.puntos} pts</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="fin-mano-actions">
                    {hayGanador ? (
                        <>
                            <p className="contador-texto">
                                {jugadoresOrdenados[0]?.nombre} llego a 0 puntos!
                            </p>
                            <Buttons
                                label="Ver Resultado"
                                onClick={handleContinuar}
                            />
                        </>
                    ) : (
                        <>
                            <p className="contador-texto">Nueva mano en {contador}s...</p>
                            <Buttons
                                label="Continuar Ahora"
                                onClick={handleContinuar}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
