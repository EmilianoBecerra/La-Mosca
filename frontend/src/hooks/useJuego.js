import { useContext, useState, useEffect, useRef } from "react";


import { GlobalContext } from "../context/GlobalContext";

export function useJuego() {
  const { mesa, setMesa, socketRef, setEstadoPantalla, setFinPartida } = useContext(GlobalContext);

  const [rondaActual, setRondaActual] = useState([]);
  const [resultadoRonda, setResultadoRonda] = useState(null);
  const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);
  const rondaActualRef = useRef(rondaActual);
  const nombre = localStorage.getItem("nombreJugador");


  useEffect(() => {
    rondaActualRef.current = rondaActual;
  }, [rondaActual]);

  useEffect(() => {
    const socket = socketRef.current;

    socket.on("carta-jugada", ({ nombre, carta }) => {
      setRondaActual(prev => [...prev, { nombre, carta }]);
    })

    socket.on("ronda-terminada", ({ ganador, cartaGanadora, cartasJugadas }) => {
      setResultadoRonda({
        ganador, cartaGanadora,
        cartasJugadas: cartasJugadas || [...rondaActualRef.current]
      });
      setRondaActual([]);
      setTimeout(() => setResultadoRonda(null), 2000);
    });

    socket.on("fin-mano", (mesaActualizada) => {
      setMesa(mesaActualizada);
      setRondaActual([]);
      setTimeout(() => setEstadoPantalla("fin-mano"), 1500);
    })

    socket.on("ganador", (jugador) => {
      setMesa(prev => {
        if (prev) setFinPartida({ ganador: jugador?.nombre, jugadores: prev.jugadores });
        return prev;
      });
      setEstadoPantalla("fin-partida");
    })


    return () => {
      socket.off("carta-jugada");
      socket.off("ronda-terminada");
      socket.off("fin-mano");
      socket.off("ganador");
    }

  }, [socketRef, setMesa, setEstadoPantalla, setFinPartida])
  
  const descartarCartas = (cartasSeleccionadas) => {
    socketRef.current.emit("descarte", nombre, cartasSeleccionadas, mesa.nombre);
  }
  const jugarCarta = (carta) => {
    socketRef.current.emit("jugar-carta", { nombreMesa: mesa.nombre, nombreJugador: nombre, carta })
  }
  const salirMesa = () => {
    socketRef.current.emit("salir-mesa", nombre);
  }

  return {
    mesa, nombre, rondaActual, resultadoRonda, cartasSeleccionadas, setCartasSeleccionadas, descartarCartas, jugarCarta, salirMesa
  }

}