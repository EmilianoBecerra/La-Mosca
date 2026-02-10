import { createContext, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";

export const GlobalContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const crearSocket = (token) => {
  return io(BACKEND_URL, {
    auth: token ? { token } : {},
    transports: ["websocket"],
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
  });
};

export const GlobalContextProvider = (props) => {
  const socketRef = useRef(crearSocket(localStorage.getItem("token")));
  const mesaPendienteRef = useRef(null);

  const reconectarSocket = (token) => {
    socketRef.current.auth = { token };
    socketRef.current.disconnect().connect();
  };

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

  const guardarCredenciales = useCallback((nombre) => {
    localStorage.setItem("nombreJugador", nombre);
    setNombreJugador(nombre);
    setNombreGuardado(nombre);
    setAutenticado(true);
  }, []);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem("nombreJugador");
    localStorage.removeItem("token");
    socketRef.current.auth = {};
    socketRef.current.disconnect().connect();
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

  const registrarJugador = async (nombre, codigo) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, codigo })
      });
      const data = await res.json();
      if (!data.ok) {
        mostrarModal(data.msg, "error");
        return;
      }
      localStorage.setItem("token", data.data.token);
      guardarCredenciales(data.data.nombre);
      reconectarSocket(data.data.token);
    } catch (error) {
      mostrarModal("Error solicitud de registro de usuario", "error");
    }
  };

  const loginJugador = async (nombre, codigo) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, codigo })
      });
      const data = await res.json();
      if (!data.ok) {
        mostrarModal(data.msg, "error");
        if (data.msg === "Jugador no existe") {
          cerrarSesion();
        }
        return;
      }
      localStorage.setItem("token", data.data.token);
      guardarCredenciales(data.data.nombre);
      reconectarSocket(data.data.token);
    } catch (error) {
      mostrarModal("Error en solicitud de login", "error");
    }
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
          if (prev && prev.nombre !== data.nombre) {
            mostrarModal(`Ya estás en la mesa "${data.nombre}". Salí de ella para unirte a otra.`, "info");
          } else if (!prev) {
            mostrarModal(`Ya estás en la mesa "${data.nombre}". Salí de ella para crear o unirte a otra.`, "info");
          }
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
      setRondaActual([]);
      setTimeout(() => {
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

    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${BACKEND_URL}/auth/verify`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            guardarCredenciales(data.data);
            reconectarSocket(token);
          } else {
            localStorage.removeItem("token");
            cerrarSesion();
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }

    const handleReconnect = () => {
      const token = localStorage.getItem("token");
      if (token) {
        socketRef.current.auth = { token };
      }
    };
    socket.io.on("reconnect", handleReconnect);

    return () => {
      socket.removeAllListeners();
      socket.io.off("reconnect", handleReconnect);
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

