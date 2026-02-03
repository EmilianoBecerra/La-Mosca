import { useContext } from "react";
import "./Mesa.css";
import { GlobalContext } from "../../../../context/GlobalContext";
import { Buttons } from "../../../parts/Buttons";

export function Mesa() {
  const { mesa, nombreJugador, jugadorListo, salirMesa } = useContext(GlobalContext);

  const handleListo = () => {
    jugadorListo();
  };

  const handleSalir = () => {
    salirMesa();
  };

  if (!mesa) {
    return (
      <div className="mesa-loading">
        <div className="spinner"></div>
        <p>Conectando a la mesa...</p>
      </div>
    );
  }

  const miJugador = mesa.jugadores.find(j => j.nombre === nombreJugador);
  const jugadoresListos = mesa.jugadores.filter(j => j.ready).length;
  const totalJugadores = mesa.jugadores.length;
  const puedeIniciar = totalJugadores >= 2;
  const todosListos = jugadoresListos === totalJugadores && puedeIniciar;

  return (
    <div className="mesa sala-espera">
      <div className="mesa-header">
        <div className="mesa-titulo">
          <h2>{mesa.nombre}</h2>
          <span className="mesa-id">ID: {String(mesa.id).slice(0, 8)}...</span>
        </div>
        <div className={`estado-badge ${todosListos ? 'iniciando' : ''}`}>
          {todosListos ? 'Iniciando partida...' : 'Esperando jugadores'}
        </div>
      </div>

      <div className="jugadores-info">
        <div className="info-item">
          <span className="info-value">{totalJugadores}/6</span>
          <span className="info-label">Jugadores</span>
        </div>
        <div className="info-divider"></div>
        <div className="info-item">
          <span className="info-value">{jugadoresListos}/{totalJugadores}</span>
          <span className="info-label">Listos</span>
        </div>
      </div>

      <div className="jugadores-grid">
        {mesa.jugadores.map((jugador) => {
          const esYo = jugador.nombre === nombreJugador;
          return (
            <div
              key={jugador.id}
              className={`jugador-slot ${esYo ? 'yo' : ''} ${jugador.ready ? 'listo' : ''}`}
            >
              <div className="jugador-avatar">
                <span className="avatar-emoji">
                  {esYo ? '😎' : '👤'}
                </span>
                {jugador.ready && (
                  <span className="check-mark">✓</span>
                )}
              </div>
              <div className="jugador-details">
                <span className="jugador-nombre">
                  {jugador.nombre}
                  {esYo && <span className="tu-badge">(Tu)</span>}
                </span>
                <div className="jugador-tags">
                  {jugador.posicionMesa === 0 && (
                    <span className="host-badge">Host</span>
                  )}
                  <span className={`estado-tag ${jugador.ready ? 'listo' : 'esperando'}`}>
                    {jugador.ready ? 'Listo' : 'Esperando'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {Array.from({ length: 6 - totalJugadores }).map((_, i) => (
          <div key={`empty-${i}`} className="jugador-slot vacio">
            <div className="jugador-avatar vacio">
              <span className="avatar-emoji">?</span>
            </div>
            <span className="jugador-nombre">Esperando...</span>
          </div>
        ))}
      </div>

      {!puedeIniciar && (
        <div className="mensaje-minimo">
          <span className="warning-icon">⚠️</span>
          Se necesitan al menos 2 jugadores para iniciar la partida
        </div>
      )}

      <div className="mesa-actions">
        <Buttons
          type="button"
          label={miJugador?.ready ? "¡Listo!" : "Estoy listo"}
          onClick={handleListo}
          disabled={miJugador?.ready}
        />
        <button className="btn-salir" onClick={handleSalir}>
          Salir de la mesa
        </button>
      </div>
    </div>
  );
}
