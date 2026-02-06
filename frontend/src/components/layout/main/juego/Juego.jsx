import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../../../../context/GlobalContext";
import "./Juego.css";
import { Buttons } from "../../../parts/Buttons";

const ICONOS_PALO = {
  oro: "🪙",
  espada: "⚔️",
  basto: "🪵",
  copa: "🏆"
};

const capitalizarNombre = (nombre) => {
  if (!nombre) return "";
  return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
};

export function Juego() {
  const { mesa, nombreJugador, descartarCartas, jugarCarta, rondaActual, resultadoRonda, salirMesa } = useContext(GlobalContext);
  const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);
  const mesaRef = useRef(null);

  useEffect(() => {
    if (!mesa) return;
    if (mesa.estado === "en-partida") {
      setCartasSeleccionadas([]); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [mesa]);

  useEffect(() => {
    if (mesa?.estado === "descarte" || mesa?.estado === "en-partida") {
      mesaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [mesa?.estado]);


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
  };

  const handleJugarCarta = (carta) => {
    if (!esPartida || !esMiTurno || resultadoRonda) return;
    jugarCarta(carta);
  };

  return (
    <div className="juego-container">
      <div className="info-mesa">
        <div className="info-left">
          <h2>{capitalizarNombre(mesa.nombre)}</h2>
          <span className="ronda-info">Ronda {mesa.ronda + 1}</span>
          <span className="fase-badge">
            {esDescarte ? "Descarte" : "En Partida"}
          </span>
        </div>
        <div className="triunfo-central">
          <span className="triunfo-label">Triunfo</span>
          <span className={`palo-badge-grande ${mesa.triunfo?.toLowerCase()}`}>
            {ICONOS_PALO[mesa.triunfo?.toLowerCase()]} {mesa.triunfo}
          </span>
        </div>
        <div className="info-right">
          <button className="btn-abandonar" onClick={salirMesa}>
            Abandonar
          </button>
        </div>
      </div>

      <div className="mesa-poker">
        <div className="posiciones-rivales">
          {otrosJugadores.map((jugador) => {
            const esElTurno = jugador._id?.toString() === jugadorEnTurno?._id?.toString();
            return (
              <div
                key={jugador.nombre}
                className={`rival-seat ${esElTurno ? 'turno-activo' : ''}`}
              >
                <div className="rival-cartas-back">
                  {Array.from({ length: jugador.cartas?.length || 0 }).map((_, i) => (
                    <div key={i} className="carta-back-mini" />
                  ))}
                </div>
                <span className="rival-nombre">{capitalizarNombre(jugador.nombre)}</span>
                <div className="rival-stats">
                  <span className="rival-puntos">⭐ {jugador.puntos}</span>
                  {esElTurno && <span className="rival-turno">▶</span>}
                  {esDescarte && jugador.listoParaDescartar && (
                    <span className="listo-badge">Listo</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div ref={mesaRef} className="mesa-oval">
          {(() => {
            const cartasEnJuego = resultadoRonda?.cartasJugadas || rondaActual;
            const cartasRivales = cartasEnJuego.filter(j => j.nombre !== nombreJugador);
            const miCarta = cartasEnJuego.find(j => j.nombre === nombreJugador);

            return (
              <>
                <div className="mesa-zona-rivales">
                  {cartasRivales.map((jugada, idx) => {
                    const esGanadora = resultadoRonda &&
                      jugada.carta.numero === resultadoRonda.cartaGanadora?.numero &&
                      jugada.carta.palo === resultadoRonda.cartaGanadora?.palo;
                    return (
                      <div key={idx} className="carta-jugada-pos">
                        <span className="jugador-nombre-ronda">{capitalizarNombre(jugada.nombre)}</span>
                        <div className={`carta ${jugada.carta.palo.toLowerCase()} ${esGanadora ? 'carta-ganadora' : ''}`}>
                          <span className="numero">{jugada.carta.numero}</span>
                          <span className="palo-icon">{ICONOS_PALO[jugada.carta.palo.toLowerCase()]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mesa-zona-centro">
                  {resultadoRonda ? (
                    <div className="resultado-ronda">
                      <span className="resultado-icon">🏆</span>
                      <h4>¡{capitalizarNombre(resultadoRonda.ganador)} gana!</h4>
                    </div>
                  ) : cartasEnJuego.length === 0 ? (
                    <div className="esperando-jugadas">
                      {esDescarte ? (
                        <p>Selecciona cartas para descartar</p>
                      ) : esPartida ? (
                        <p>{esMiTurno ? "¡Tu turno!" : `Esperando a ${capitalizarNombre(jugadorEnTurno?.nombre)}...`}</p>
                      ) : (
                        <p>Esperando...</p>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="mesa-zona-yo">
                  {miCarta && (() => {
                    const esGanadora = resultadoRonda &&
                      miCarta.carta.numero === resultadoRonda.cartaGanadora?.numero &&
                      miCarta.carta.palo === resultadoRonda.cartaGanadora?.palo;
                    return (
                      <div className="carta-jugada-pos">
                        <div className={`carta ${miCarta.carta.palo.toLowerCase()} ${esGanadora ? 'carta-ganadora' : ''}`}>
                          <span className="numero">{miCarta.carta.numero}</span>
                          <span className="palo-icon">{ICONOS_PALO[miCarta.carta.palo.toLowerCase()]}</span>
                        </div>
                        <span className="jugador-nombre-ronda">Tú</span>
                      </div>
                    );
                  })()}
                </div>
              </>
            );
          })()}
        </div>

        <div className="mi-posicion">
          <div className="mi-info">
            <h3>{capitalizarNombre(miJugador?.nombre)}</h3>
            <span className="mis-puntos">⭐ {miJugador?.puntos}</span>
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
