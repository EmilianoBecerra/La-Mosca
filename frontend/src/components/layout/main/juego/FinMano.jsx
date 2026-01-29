import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../../context/GlobalContext";
import { Buttons } from "../../../parts/Buttons";
import "./FinMano.css";

export function FinMano() {
    const { mesa, nuevaMano, nombreJugador } = useContext(GlobalContext);
    const [contador, setContador] = useState(10);

    useEffect(() => {
        if (contador > 0) {
            const timer = setTimeout(() => setContador(contador - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            nuevaMano();
        }
    }, [contador, nuevaMano]);

    if (!mesa) return null;

    const jugadoresOrdenados = [...mesa.jugadores].sort((a, b) => a.puntos - b.puntos);

    const handleContinuar = () => {
        nuevaMano();
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
                    <p className="contador-texto">Nueva mano en {contador}s...</p>
                    <Buttons
                        label="Continuar Ahora"
                        onClick={handleContinuar}
                    />
                </div>
            </div>
        </div>
    );
}
