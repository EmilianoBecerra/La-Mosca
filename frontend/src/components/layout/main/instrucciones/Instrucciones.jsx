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
                <section className="seccion">
                    <h3>Objetivo del Juego</h3>
                    <p>
                      Cada jugador comienza con 20 puntos y pierde 1 punto por cada ronda ganada.
                      El objetivo es <strong>llegar a 0 puntos.</strong>. 
                    </p>
                </section>

                <section className="seccion">
                    <h3>Jugadores y Cartas</h3>
                    <ul>
                        <li>De <strong>2 a 6 jugadores</strong> por mesa</li>
                        <li>Se usa un mazo español de <strong>48 cartas</strong> (4 palos, 12 cartas cada uno)</li>
                        <li>Palos: Oro, Espada, Basto y Copa</li>
                        <li>Cada jugador recibe <strong>5 cartas</strong></li>
                    </ul>
                </section>

                <section className="seccion">
                    <h3>El Triunfo</h3>
                    <p>
                        Al repartir, la <strong>última carta del repartidor</strong> determina el palo de triunfo.
                        Las cartas de triunfo <strong>ganan a cualquier otro palo</strong>.
                    </p>
                </section>

                <section className="seccion">
                    <h3>Fuerza de las Cartas</h3>
                    <p>De mayor a menor fuerza:</p>
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
                    <p className="nota">El 1 (As) es la carta mas fuerte, el 2 es la mas debil.</p>
                </section>

                <section className="seccion">
                    <h3>Fase de Descarte</h3>
                    <p>
                        Antes de jugar, cada jugador puede <strong>descartar cartas</strong> de su mano
                        y recibir nuevas del mazo. Esto es opcional.
                    </p>
                    <ul>
                        <li>Selecciona las cartas que quieras descartar</li>
                        <li>Presiona "Descartar" para confirmar</li>
                        <li>O presiona "No descartar" para quedarte con tus cartas</li>
                    </ul>
                </section>

                <section className="seccion">
                    <h3>Como se Juega</h3>
                    <ol>
                        <li>El jugador a la derecha del repartidor comienza</li>
                        <li>Cada jugador juega <strong>una carta</strong> en su turno</li>
                        <li>Cuando todos jugaron, se determina el ganador de la ronda</li>
                        <li>El ganador de la ronda <strong>pierde 1 punto</strong> y comienza la siguiente</li>
                        <li>Se juegan <strong>5 rondas</strong> por mano (hasta agotar las cartas)</li>
                    </ol>
                </section>

                <section className="seccion">
                    <h3>Quien Gana la Ronda</h3>
                    <ul>
                        <li>Si hay cartas de <strong>triunfo</strong>, gana la carta de triunfo mas fuerte</li>
                        <li>Si no hay triunfos, gana la carta mas fuerte <strong>del palo de salida</strong> (el palo de la primera carta jugada)</li>
                    </ul>
                </section>

                <section className="seccion">
                    <h3>Fin de la Mano</h3>
                    <p>
                        Cuando se juegan las 5 rondas, termina la mano.
                        El repartidor rota al siguiente jugador y comienza una nueva mano.
                    </p>
                </section>
            </div>
        </div>
    );
}
