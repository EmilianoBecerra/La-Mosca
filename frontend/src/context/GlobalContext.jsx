import { createContext, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";

// eslint-disable-next-line react-refresh/only-export-components
export const GlobalContext = createContext(null);

const crearSocket = () => {
  return io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000");
};

export const GlobalContextProvider = (props) => {
  const socketRef = useRef(crearSocket());
  const mesaPendienteRef = useRef(null);

  const [mesas, setMesas] = useState([]);
  const [mesa, setMesa] = useState(null);
  const [estadoPantalla, setEstadoPantalla] = useState("lobby");
  const [mesaId, setMesaId] = useState("");
  const [nombreGuardado, setNombreGuardado] = useState(() => {
    return localStorage.getItem("nombreJugador") || "";
  });
  const [nombreJugador, setNombreJugador] = useState(() => {
    return localStorage.getItem("nombreJugador") || "";
  });
  const [autenticado, setAutenticado] = useState(false);

  const guardarCredenciales = useCallback((nombre, codigo) => {
    localStorage.setItem("nombreJugador", nombre);
    if (codigo) {
      localStorage.setItem("codigoJugador", codigo);
    }
    setNombreJugador(nombre);
    setNombreGuardado(nombre);
    setAutenticado(true);
  }, []);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem("nombreJugador");
    localStorage.removeItem("codigoJugador");
    setNombreJugador("");
    setNombreGuardado("");
    setAutenticado(false);
    setMesa(null);
    setMesaId("");
    setEstadoPantalla("lobby");
  }, []);
  const [error, setError] = useState("");
  const [rondaActual, setRondaActual] = useState([]);
  const rondaActualRef = useRef(rondaActual);

  useEffect(() => {
    rondaActualRef.current = rondaActual;
  }, [rondaActual]);

  const [resultadoRonda, setResultadoRonda] = useState(null);
  const [finPartida, setFinPartida] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [modal, setModal] = useState({ visible: false, mensaje: "", tipo: "info" });

  const mostrarModal = useCallback((mensaje, tipo = "info") => {
    setModal({ visible: true, mensaje, tipo });
  }, []);

  const cerrarModal = () => {
    setModal({ visible: false, mensaje: "", tipo: "info" });
  };
  const codigoTempRef = useRef(null);

  const registrarJugador = (nombre, codigo) => {
    codigoTempRef.current = codigo;
    socketRef.current.emit("registrar-jugador", nombre, codigo);
  };

  const loginJugador = (nombre, codigo) => {
    codigoTempRef.current = codigo;
    socketRef.current.emit("login", nombre, codigo);
  };
  const configurarListeners = useCallback((sock) => {
    sock.on("mesas-disponibles", (mesas) => {
      setMesas(mesas);
      if (mesaPendienteRef.current) {
        const mesaEncontrada = mesas.find(m => m.nombre === mesaPendienteRef.current);
        if (mesaEncontrada) {
          setMesa(mesaEncontrada);
          setMesaId(mesaEncontrada._id || mesaEncontrada.nombre);
          setEstadoPantalla("mesa");
          mesaPendienteRef.current = null;
        }
      }
    });
    sock.on("mesa_creada_exito", (nombreMesa) => {
      mesaPendienteRef.current = nombreMesa;
      setMesas(prev => {
        const mesaEncontrada = prev.find(m => m.nombre === nombreMesa);
        if (mesaEncontrada) {
          setMesa(mesaEncontrada);
          setMesaId(mesaEncontrada._id || mesaEncontrada.nombre);
          setEstadoPantalla("mesa");
          mesaPendienteRef.current = null;
        }
        return prev;
      });
    });
    sock.on("jugador-enMesa", (data) => {
      if (typeof data === 'object' && data !== null && data.jugadores) {
        setMesa(prev => {
          // Solo mostrar modal si intenta entrar a una mesa diferente o crear otra
          if (prev && prev.nombre !== data.nombre) {
            mostrarModal(`Ya estás en la mesa "${data.nombre}". Salí de ella para unirte a otra.`, "info");
          } else if (!prev) {
            // Si no tiene mesa en el estado pero el servidor dice que sí está en una
            mostrarModal(`Ya estás en la mesa "${data.nombre}". Salí de ella para crear o unirte a otra.`, "info");
          }
          // Si prev.nombre === data.nombre, no mostrar modal (ya está en esa mesa)
          return data;
        });
        setMesaId(data._id || data.nombre);
        setEstadoPantalla("mesa");
      }
    });
    sock.on("actualizar-mesa", (mesaActualizada) => {
      setMesa(mesaActualizada);
    });
    sock.on("confirmacion-registro", (mesaRecibida) => {
      setMesa(mesaRecibida);
      setMesaId(mesaRecibida._id);
      setEstadoPantalla("mesa");
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
    sock.on("carta-jugada", ({ nombre, carta }) => {
      setRondaActual(prev => [...prev, { nombre, carta }]);
    });
    sock.on("ronda-terminada", ({ ganador, cartaGanadora, cartasJugadas }) => {
      setResultadoRonda({
        ganador,
        cartaGanadora,
        cartasJugadas: cartasJugadas || [...rondaActualRef.current]
      });
      setTimeout(() => {
        setRondaActual([]);
        setResultadoRonda(null);
      }, 2000);
    });
    sock.on("esperando-descarte", (mesaActualizada) => {
      setMesa(mesaActualizada);
      setEstadoPantalla("descarte");
    });
    sock.on("listos-jugar", (mesaActualizada) => {
      setMesa(mesaActualizada);
      setRondaActual([]);
      setEstadoPantalla("en-partida");
    });
    sock.on("fin-mano", (mesaActualizada) => {
      setMesa(mesaActualizada);
      setTimeout(() => {
        setEstadoPantalla("fin-mano");
      }, 1500);
    });
    sock.on("ganador", (jugadorGanador) => {
      setMesa(prev => {
        if (prev) {
          setFinPartida({
            ganador: jugadorGanador?.nombre,
            jugadores: prev.jugadores
          });
        }
        return prev;
      });
      setEstadoPantalla("fin-partida");
    });
    sock.on("ranking-global", (data) => {
      setRanking(data || []);
    });
    sock.on("error", (msg) => {
      setError(msg);
      mostrarModal(msg, "error");
      if (msg === "Jugador no existe" || msg === "Codigo incorrecto o jugador no existe.") {
        cerrarSesion(); // Borra nombreGuardado, App.jsx mostrará registro automáticamente
      }
    });
    sock.on("jugador-registrado", (jugador) => {
      guardarCredenciales(jugador.nombre, codigoTempRef.current);
    });
    sock.on("loguear-jugador", (jugador) => {
      guardarCredenciales(jugador.nombre, codigoTempRef.current);
    });
    sock.on("error-registro", (msg) => {
      setError(msg);
      mostrarModal(msg, "error");
      if (msg === "Error al registrar usuario en base de datos.") {
        cerrarSesion();
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
      setMesaId(mesaRecibida._id || mesaRecibida.nombre);
      setRondaActual([]);
      const estado = mesaRecibida.estado;
      if (estado === "descarte") {
        setEstadoPantalla("descarte");
      } else if (estado === "en-partida") {
        setEstadoPantalla("en-partida");
      } else if (estado === "fin-mano") {
        setEstadoPantalla("fin-mano");
      } else {
        setEstadoPantalla("mesa");
      }
    });
  }, [cerrarSesion, guardarCredenciales, mostrarModal]);

  const crearMesa = (nombreMesa) => {
    const nombre = localStorage.getItem("nombreJugador");
    if (!nombre) {
      console.error("No hay jugador registrado");
      return;
    }
    socketRef.current.emit("crear-mesa", nombre, nombreMesa);
  };

  const unirseMesa = (nombreMesa) => {
    const nombre = localStorage.getItem("nombreJugador");
    if (!nombre) {
      console.error("No hay jugador registrado");
      return;
    }
    socketRef.current.emit("ingresar-en-mesa", nombre, nombreMesa);
  };

  const jugadorListo = () => {
    const nombre = localStorage.getItem("nombreJugador");
    if (nombre) {
      socketRef.current.emit("jugador-listo", nombre);
    }
  };

  const descartarCartas = (indices) => {
    const nombre = localStorage.getItem("nombreJugador");
    if (mesa && mesa._id && nombre) {
      socketRef.current.emit("descarte", nombre, indices, mesa.nombre);
    }
  };

  const jugarCarta = (carta) => {
    const nombre = localStorage.getItem("nombreJugador");
    if (mesa && mesa._id && nombre) {
      socketRef.current.emit("jugar-carta", { nombreMesa: mesa.nombre, nombreJugador: nombre, carta });
    }
  };

  const salirMesa = () => {
    const nombre = localStorage.getItem("nombreJugador");
    if (nombre) {
      socketRef.current.emit("salir-mesa", nombre);
    }
  };

  const nuevaMano = () => {
    if (mesa && mesa._id) {
      socketRef.current.emit("nueva-mano", mesa.nombre);
    }
  };

  const finalizarPartida = () => {
    if (mesa) {
      socketRef.current.emit("fin-partida", mesa.nombre);
    }
  };

  const actualizarRanking = useCallback(() => {
    socketRef.current.emit("actualizar-ranking");
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    configurarListeners(socket);

    // Auto-login si hay credenciales guardadas
    const nombreGuardado = localStorage.getItem("nombreJugador");
    const codigoGuardado = localStorage.getItem("codigoJugador");

    if (nombreGuardado && codigoGuardado) {
      codigoTempRef.current = codigoGuardado;
      socket.emit("login", nombreGuardado, codigoGuardado);
    }

    return () => {
      socket.removeAllListeners();
    };
  }, [configurarListeners]);
  
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
        const nombre = localStorage.getItem("nombreJugador");
        if (nombre) {
          socketRef.current.emit("salir-mesa", nombre);
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
      nombreGuardado,
      autenticado,
      registrarJugador,
      loginJugador,
      cerrarSesion,
      crearMesa,
      unirseMesa,
      jugadorListo,
      descartarCartas,
      jugarCarta,
      salirMesa,
      nuevaMano,
      finalizarPartida,
      rondaActual,
      resultadoRonda,
      finPartida,
      setFinPartida,
      error,
      modal,
      mostrarModal,
      cerrarModal,
      ranking,
      actualizarRanking
    }}>
      {props.children}
    </GlobalContext.Provider>
  )
}

