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
                    <p>
                        Bienvenidos a la Mosca, un juego argentino multijugador online en tiempo real.
                    </p>
                </section>

                <section className="seccion">
                    <h3>Modo de Juego</h3>
                    <ol>
                        <li>
                            Se reparten <strong>5 cartas</strong> a cada jugador, como mínimo puede haber
                            <strong> 2 jugadores</strong> y como máximo <strong>6</strong>, de un mazo de cartas
                            españolas completo menos los comodines. Cada jugador comienza la partida con
                            <strong> 20 puntos</strong>.
                        </li>
                        <li>
                            Cuando todos los jugadores tienen sus cartas comienza la <strong>fase de descarte</strong>:
                            <ul>
                                <li>
                                    Cada jugador tiene la posibilidad de descartar las cartas que no le interesan,
                                    también puede rechazar el descarte y quedarse con todas las cartas.
                                </li>
                            </ul>
                        </li>
                        <li>
                            Una vez que todos descartan, se vuelven a repartir para que todos los jugadores
                            queden con 5 cartas en la mano.
                        </li>
                        <li>Empieza la primera ronda.</li>
                        <li>
                            Cada jugador tirará una carta empezando por el que le sigue a quién repartió.
                        </li>
                        <li>
                            Luego, se determina quién ganó la ronda según el <strong>sistema de valor</strong>.
                        </li>
                        <li>Al ganador de la ronda se le <strong>resta un punto</strong>.</li>
                        <li>
                            Al tirar las cinco cartas, se completa una mano. Quien no haya ganado
                            alguna ronda, se le <strong>suman cinco puntos</strong>.
                        </li>
                        <li>Se vuelven a repetir los pasos desde el punto dos.</li>
                        <li>El primero que llegue a <strong>0 gana</strong>.</li>
                    </ol>
                </section>

                <section className="seccion">
                    <h3>Sistema de Valor de las Cartas</h3>
                    <p>
                        Al repartir las cartas, la última carta repartida determina el <strong>palo del triunfo</strong>,
                        que es el palo más fuerte. Luego se determina por el número de la carta, siendo
                        el 1 el más fuerte, luego el 3, y luego del 12 al 2.
                    </p>
                    <p className="nota">
                        <strong>Palo:</strong> Triunfo &gt; cualquier otro palo.
                        Si no se juega ningún triunfo en la ronda, el primer palo jugado será el de mayor valor.
                    </p>
                    <p><strong>Número:</strong></p>
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
                </section>
            </div>
        </div>
    );
}
