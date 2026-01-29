import { createContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// eslint-disable-next-line react-refresh/only-export-components
export const GlobalContext = createContext(null);

const crearSocket = () => {
  return io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000");
};

export const GlobalContextProvider = (props) => {
  const socketRef = useRef(crearSocket());

  const [mesas, setMesas] = useState([]);
  const [mesa, setMesa] = useState(null);
  const [estadoPantalla, setEstadoPantalla] = useState("lobby");
  const [mesaId, setMesaId] = useState("");
  const [nombreJugador, setNombreJugador] = useState(() => {
    return localStorage.getItem("nombreJugador") || "";
  });

  const guardarNombreJugador = (nombre) => {
    localStorage.setItem("nombreJugador", nombre);
    setNombreJugador(nombre);
  };
  const [error, setError] = useState("");
  const [rondaActual, setRondaActual] = useState([]);
  const [resultadoRonda, setResultadoRonda] = useState(null);
  const [finPartida, setFinPartida] = useState(null);
  const [modal, setModal] = useState({ visible: false, mensaje: "", tipo: "info" });

  const mostrarModal = (mensaje, tipo = "info") => {
    setModal({ visible: true, mensaje, tipo });
  };

  const cerrarModal = () => {
    setModal({ visible: false, mensaje: "", tipo: "info" });
  };
  const registrarJugador = (nombre) => {
    socketRef.current.emit("registrar-jugador", nombre);
  };
  const obtenerJugador = (id) => {
    socketRef.current.emit("obtener-jugador", id);
  };
  const configurarListeners = (sock) => {
    sock.on("mesas-disponibles", (mesas) => {
      setMesas(mesas);
    });
    sock.on("mesa-creada", (nuevaMesa) => {
      setMesa(nuevaMesa);
      setMesaId(nuevaMesa._id);
      setEstadoPantalla("mesa");
    });
    sock.on("actualizar-mesa", (mesaActualizada) => {
      setMesa(mesaActualizada);
    });
    sock.on("confirmacion-registro", (mesaRecibida) => {
      setMesa(mesaRecibida);
      setMesaId(mesaRecibida._id);
      setEstadoPantalla("mesa");
    });
    sock.on("mesa-jugador", (mesaRecibida) => {
      setMesa(mesaRecibida);
      setMesaId(mesaRecibida._id);
      setEstadoPantalla("mesa");
    });
    sock.on("jugador-existente", (jugador) => {
      localStorage.setItem("odId", jugador._id);
      guardarNombreJugador(jugador.nombre);
    });
    sock.on("jugador-nuevo", (jugador) => {
      setMesa(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          jugadores: [...(prev.jugadores || []), jugador]
        };
      });
    });
    sock.on("iniciar-partida", (mesaPartida) => {
      setMesa(mesaPartida);
      setRondaActual([]);
      setEstadoPantalla("en-partida");
    });
    sock.on("carta-jugada", ({ id, carta }) => {
      setRondaActual(prev => [...prev, { id, carta }]);
    });
    sock.on("ronda-terminada", ({ ganador, cartaGanadora }) => {
      setResultadoRonda({
        ganador,
        cartaGanadora,
        cartasJugadas: [...rondaActual]
      });
      setTimeout(() => {
        setRondaActual([]);
        setResultadoRonda(null);
      }, 2000);
    });
    sock.on("fase-descarte", (mesaActualizada) => {
      setMesa(mesaActualizada);
      setRondaActual([]);
    });
    sock.on("esperando-descarte", (mesaActualizada) => {
      setMesa(mesaActualizada);
      setEstadoPantalla("descarte");
    });
    sock.on("listos-jugar", (mesaActualizada) => {
      setMesa(mesaActualizada);
      setEstadoPantalla("en-partida");
    });
    sock.on("fin-mano", (mesaActualizada) => {
      setMesa(mesaActualizada);
      setTimeout(() => {
        setEstadoPantalla("fin-mano");
      }, 3000);
    });
    sock.on("fin-partida", ({ ganador, jugadores }) => {
      setFinPartida({ ganador, jugadores });
      setEstadoPantalla("fin-partida");
    });
    sock.on("error", (msg) => {
      setError(msg);
      mostrarModal(msg, "error");
    });
    sock.on("jugador-registrado", (jugador) => {
      localStorage.setItem("odId", jugador._id);
      guardarNombreJugador(jugador.nombre);
    });
    sock.on("info-jugador", (jugador) => {
      localStorage.setItem("odId", jugador._id);
      guardarNombreJugador(jugador.nombre);
    });
    sock.on("error-registro", (msg) => {
      setError(msg);
      mostrarModal(msg, "error");
      if (msg === "Error al registrar usuario en base de datos.") {
        localStorage.removeItem("odId");
        localStorage.removeItem("nombreJugador");
        setNombreJugador("");
      }
    });
    sock.on("saliste-mesa", () => {
      setMesa(null);
      setMesaId("");
      setEstadoPantalla("lobby");
    });
    sock.on("jugador-salio", ({ mesa: mesaActualizada }) => {
      setMesa(mesaActualizada);
    });
    sock.on("mesa-eliminada", () => {
      setMesa(null);
      setMesaId("");
      setEstadoPantalla("lobby");
    });
    sock.on("reconectar-partida", (mesaRecibida) => {
      setMesa(mesaRecibida);
      setMesaId(mesaRecibida._id);
      setEstadoPantalla("en-partida");
    });
  };

  const crearMesa = (nombreMesa) => {
    const idCreador = localStorage.getItem("odId");
    if (!idCreador) {
      console.error("No hay jugador registrado (odId no existe en localStorage)");
      return;
    }
    socketRef.current.emit("crear-mesa", idCreador, nombreMesa);
  };

  const unirseMesa = (idMesa) => {
    const idJugador = localStorage.getItem("odId");
    setMesaId(idMesa);
    socketRef.current.emit("registrar-en-mesa", idJugador, idMesa);
  };

  const jugadorListo = () => {
    const idJugador = localStorage.getItem("odId");
    if (idJugador) {
      socketRef.current.emit("jugador-listo", idJugador);
    }
  };

  const descartarCartas = (indices) => {
    const idJugador = localStorage.getItem("odId");
    if (mesa && mesa._id && idJugador) {
      socketRef.current.emit("descarte", idJugador, indices, mesa._id);
    }
  };

  const jugarCarta = (carta) => {
    const idJugador = localStorage.getItem("odId");
    if (mesa && mesa._id && idJugador) {
      socketRef.current.emit("jugar-carta", { idMesa: mesa._id, idJugador, carta });
    }
  };

  const salirMesa = () => {
    const idJugador = localStorage.getItem("odId");
    if (idJugador) {
      socketRef.current.emit("salir-mesa", idJugador);
    }
  };

  const nuevaMano = () => {
    if (mesa && mesa._id) {
      socketRef.current.emit("nueva-mano", mesa._id.toString());
    }
  };

  useEffect(() => {
    configurarListeners(socketRef.current);
    const idGuardado = localStorage.getItem("odId");
    if (idGuardado) {
      socketRef.current.emit("obtener-jugador", idGuardado);
    }

    return () => {
      socketRef.current.removeAllListeners();
    };
  }, []);
  useEffect(() => {
    const enMesaOPartida = (estadoPantalla === "en-partida" || estadoPantalla === "mesa") && mesa?._id;

    const handleBeforeUnload = (e) => {
      if (enMesaOPartida) {
        e.preventDefault();
        e.returnValue = "Estás en una mesa. Si salís, perderás tu lugar.";
        return e.returnValue;
      }
    };

    const handleUnload = () => {
      if (enMesaOPartida) {
        const idJugador = localStorage.getItem("odId");
        if (idJugador) {
          socketRef.current.emit("salir-mesa", idJugador);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [estadoPantalla, mesa?._id]);

  return (
    <GlobalContext.Provider value={{
      mesas,
      mesa,
      estadoPantalla,
      setEstadoPantalla,
      mesaId,
      setMesaId,
      nombreJugador,
      guardarNombreJugador,
      registrarJugador,
      obtenerJugador,
      crearMesa,
      unirseMesa,
      jugadorListo,
      descartarCartas,
      jugarCarta,
      salirMesa,
      nuevaMano,
      rondaActual,
      resultadoRonda,
      finPartida,
      setFinPartida,
      error,
      modal,
      mostrarModal,
      cerrarModal
    }}>
      {props.children}
    </GlobalContext.Provider>
  )
}

