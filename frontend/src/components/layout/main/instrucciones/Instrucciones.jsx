import { useContext } from "react";
import "./Instrucciones.css";
import { GlobalContext } from "../../../../context/GlobalContext";
import { Buttons } from "../../../parts/Buttons";

export function Instrucciones() {
    const { setEstadoPantalla } = useContext(GlobalContext);

    return (
        <div className="instrucciones">
            <div className="instrucciones-header">
                <h2>Como Jugar a La Mosca</h2>
                <Buttons
                    label="Volver"
                    onClick={() => setEstadoPantalla("lobby")}
                />
            </div>

            <div className="instrucciones-content">
                <section className="seccion seccion-intro">
                    <p>
                        La Mosca es un juego de cartas argentino donde el objetivo es
                        quedarte sin puntos ganando rondas. Pero cuidado: si no ganas
                        ninguna ronda en una mano, te suman puntos de penalidad.
                    </p>
                </section>

                <section className="seccion">
                    <h3>Preparacion</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Jugadores</span>
                            <span className="info-valor">2 a 4</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Mazo</span>
                            <span className="info-valor">Españolas (sin comodines)</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Cartas por jugador</span>
                            <span className="info-valor">5</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Puntos iniciales</span>
                            <span className="info-valor">20</span>
                        </div>
                    </div>
                </section>

                <section className="seccion">
                    <h3>Fases de una Mano</h3>
                    <div className="fases">
                        <div className="fase">
                            <div className="fase-numero">1</div>
                            <div className="fase-contenido">
                                <h4>Reparto</h4>
                                <p>
                                    Se reparten 5 cartas a cada jugador. La última carta
                                    repartida define el <strong>palo del triunfo</strong> (el
                                    palo mas fuerte de la mano).
                                </p>
                            </div>
                        </div>
                        <div className="fase">
                            <div className="fase-numero">2</div>
                            <div className="fase-contenido">
                                <h4>Descarte</h4>
                                <p>
                                    Podes elegir cartas de tu mano para descartarlas y recibir
                                    nuevas del mazo, o quedarte con las que tenes. Todos
                                    descartan al mismo tiempo.
                                </p>
                            </div>
                        </div>
                        <div className="fase">
                            <div className="fase-numero">3</div>
                            <div className="fase-contenido">
                                <h4>Rondas</h4>
                                <p>
                                    Se juegan <strong>5 rondas</strong>. En cada una, cada
                                    jugador tira una carta por turno, empezando por el que
                                    le sigue al repartidor. La carta mas fuerte gana la ronda.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="seccion">
                    <h3>Puntuacion</h3>
                    <div className="puntuacion-reglas">
                        <div className="regla regla-buena">
                            <span className="regla-icono">-1</span>
                            <p>Por cada ronda que ganes, se te <strong>resta 1 punto</strong>.</p>
                        </div>
                        <div className="regla regla-mala">
                            <span className="regla-icono">+5</span>
                            <p>Si no ganas ninguna ronda en toda la mano, se te <strong>suman 5 puntos</strong> de penalidad.</p>
                        </div>
                        <div className="regla regla-meta">
                            <span className="regla-icono">0</span>
                            <p>El primer jugador en llegar a <strong>0 puntos</strong> gana la partida.</p>
                        </div>
                    </div>
                </section>

                <section className="seccion">
                    <h3>Valor de las Cartas</h3>
                    <div className="valor-explicacion">
                        <div className="valor-regla">
                            <h4>Por palo</h4>
                            <p>
                                El <strong>triunfo</strong> le gana a cualquier otro palo.
                                Si nadie juega triunfo, gana el palo de la primera carta
                                jugada en esa ronda.
                            </p>
                        </div>
                        <div className="valor-regla">
                            <h4>Por numero (de mayor a menor)</h4>
                            <div className="fuerza-cartas">
                                <span className="carta-fuerte">1</span>
                                <span>&gt;</span>
                                <span>3</span>
                                <span>&gt;</span>
                                <span>12</span>
                                <span>&gt;</span>
                                <span>11</span>
                                <span>&gt;</span>
                                <span>10</span>
                                <span>&gt;</span>
                                <span>9</span>
                                <span>&gt;</span>
                                <span>8</span>
                                <span>&gt;</span>
                                <span>7</span>
                                <span>&gt;</span>
                                <span>6</span>
                                <span>&gt;</span>
                                <span>5</span>
                                <span>&gt;</span>
                                <span>4</span>
                                <span>&gt;</span>
                                <span className="carta-debil">2</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
