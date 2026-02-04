import { useContext, useEffect } from "react";
import "./Ranking.css";
import { GlobalContext } from "../../../../context/GlobalContext";
import { Buttons } from "../../../parts/Buttons";

export function Ranking() {
    const { setEstadoPantalla, ranking, actualizarRanking } = useContext(GlobalContext);

    useEffect(() => {
        actualizarRanking();
    }, [actualizarRanking]);

    const rankingOrdenado = [...ranking].sort((a, b) => b.puntos - a.puntos);

    return (
        <div className="ranking">
            <div className="ranking-header">
                <h2>Ranking Global</h2>
                <Buttons
                    label="Volver"
                    onClick={() => setEstadoPantalla("lobby")}
                />
            </div>

            <div className="ranking-content">
                {rankingOrdenado.length === 0 ? (
                    <p className="ranking-vacio">No hay jugadores en el ranking todavia.</p>
                ) : (
                    <div className="ranking-lista">
                        {rankingOrdenado.map((j, index) => (
                            <div key={j.jugador} className="ranking-row">
                                <span className="ranking-posicion">
                                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                                </span>
                                <span className="ranking-nombre">{j.jugador}</span>
                                <span className="ranking-puntos">{j.puntos} pts</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
