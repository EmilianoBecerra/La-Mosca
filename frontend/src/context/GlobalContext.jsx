import { createContext, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";

// eslint-disable-next-line react-refresh/only-export-components
export const GlobalContext = createContext( null );


let windowId = sessionStorage.getItem( "windowId" );
if ( !windowId ) {
  windowId = crypto.randomUUID();
  sessionStorage.setItem( "windowId", windowId );
}

const crearSocket = ( token ) => {
  return io( import.meta.env.VITE_BACKEND_URL, {
    auth: token ? { token, windowId } : { windowId },
    transports: ["websocket"],
    autoConnect: false,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
  } );
};

export const GlobalContextProvider = ( props ) => {
  const socketRef = useRef( null );
  if ( socketRef.current === null ) {
    socketRef.current = crearSocket( localStorage.getItem( "token" ) );
  }

  const autenticarSocket = ( token ) => {
    socketRef.current.auth = { token, windowId };
    socketRef.current.disconnect().connect();
  };

  const [mesa, setMesa] = useState( null );
  const [estadoPantalla, setEstadoPantalla] = useState( "lobby" );
  const [mesaId, setMesaId] = useState( "" );
  const [nombreGuardado, setNombreGuardado] = useState( () => {
    return localStorage.getItem( "nombreJugador" ) || "";
  } );
  const [error, setError] = useState( "" );
  const [nombreJugador, setNombreJugador] = useState( () => {
    return localStorage.getItem( "nombreJugador" ) || "";
  } );
  const [autenticado, setAutenticado] = useState( false );
  const [finPartida, setFinPartida] = useState( null );
  const [ranking, setRanking] = useState( [] );
  const guardarCredenciales = useCallback( ( nombre ) => {
    localStorage.setItem( "nombreJugador", nombre );
    setNombreJugador( nombre );
    setNombreGuardado( nombre );
    setAutenticado( true );
  }, [] );

  const [modal, setModal] = useState( { visible: false, mensaje: "", tipo: "info" } );
  const mostrarModal = useCallback( ( mensaje, tipo = "info" ) => {
    setModal( { visible: true, mensaje, tipo } );
  }, [] );
  const cerrarModal = () => {
    setModal( { visible: false, mensaje: "", tipo: "info" } );
  };


  const cerrarSesion = useCallback( async () => {
    try {
      const res = await fetch( `${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "Application/json" },
      } );
      const data = await res.json();
      if ( !data.ok ) {
        mostrarModal( "Error al cerrar la sesión", "Error" );
        return
      }
    } catch ( error ) {
      console.error( "Error al cerrar sesión", error )
    }
    localStorage.removeItem( "nombreJugador" );
    localStorage.removeItem( "token" );
    socketRef.current.auth = { windowId };
    socketRef.current.disconnect().connect();
    setNombreJugador( "" );
    setNombreGuardado( "" );
    setAutenticado( false );
    setMesa( null );
    setMesaId( "" );
    setEstadoPantalla( "lobby" );
    mostrarModal( "Sesión Finalizada", "info" )
  }, [] );


  const registrarJugador = async ( email, nombre, password ) => {
    try {
      const res = await fetch( `${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify( { email, nombre, password } )
      } );
      const data = await res.json();
      if ( !data.ok ) {
        mostrarModal( data.msg, "error" );
        return;
      }
      localStorage.setItem( "token", data.data.token );
      guardarCredenciales( data.data.nombre );
      autenticarSocket( data.data.token );
      // eslint-disable-next-line no-unused-vars
    } catch ( error ) {
      mostrarModal( "Error solicitud de registro de usuario", "error" );
    }
  };

  const loginJugador = async ( nombre, password ) => {
    try {
      const res = await fetch( `${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify( { nombre, password } )
      } );
      const data = await res.json();
      if ( !data.ok ) {
        mostrarModal( data.msg, "error" );
        if ( data.msg === "Jugador no existe" ) {
          mostrarModal( "El usuario no está registrado", "error" );
        }
        return;
      }
      localStorage.setItem( "token", data.data.token );
      guardarCredenciales( data.data.nombre );
      autenticarSocket( data.data.token );
      // eslint-disable-next-line no-unused-vars
    } catch ( error ) {
      mostrarModal( "Error al ingresar", "error" );
    }
  };


  const configurarListeners = useCallback( ( sock ) => {
    sock.on( "mesa_creada_exito", ( mesa ) => {
      setMesa( mesa );
      setMesaId( mesa._id || mesa.nombre );
      setEstadoPantalla( "mesa" );
    } );

    sock.on( "jugador-enMesa", ( data ) => {
      if ( typeof data === 'object' && data !== null && data.jugadores ) {
        setMesa( prev => {
          if ( prev && prev.nombre !== data.nombre ) {
            mostrarModal( `Ya estás en la mesa "${data.nombre}". Salí de ella para unirte a otra.`, "info" );
          } else if ( !prev ) {
            mostrarModal( `Ya estás en la mesa "${data.nombre}". Salí de ella para crear o unirte a otra.`, "info" );
          }
          return data;
        } );
        setMesaId( data._id || data.nombre );
        setEstadoPantalla( "mesa" );
      }
    } );

    sock.on( "confirmacion-registro", ( mesaRecibida ) => {
      setMesa( mesaRecibida );
      setMesaId( mesaRecibida._id );
      setEstadoPantalla( "mesa" );
    } );

    sock.on( "ranking-global", ( data ) => {
      setRanking( data || [] );
    } );

    sock.on( "error", ( msg ) => {
      setError( msg );
      mostrarModal( msg, "error" );
      if ( msg === "Jugador no existe" || msg === "password incorrecto o jugador no existe." ) {
        cerrarSesion();
      }
    } );

    sock.on( "saliste-mesa", () => {
      setMesa( null );
      setMesaId( "" );
      setEstadoPantalla( "lobby" );
    } );

    sock.on( "mesa-eliminada", () => {
      setMesa( null );
      setMesaId( "" );
      setEstadoPantalla( "lobby" );
    } );

    sock.on( "otra-ventana", () => {
      sock.disconnect();
      setAutenticado( false );
      setMesa( null );
      setMesaId( "" );
      setEstadoPantalla( "lobby" );
      mostrarModal( "Se inició sesión en otra ventana. Esta sesión fue cerrada.", "error" );
    } );

    sock.on( "actualizar-mesa", ( mesaRecibida ) => {
      setMesa( mesaRecibida );
    } );

    sock.on( "esperando-descarte", ( mesaRecibida ) => {
      setMesa( mesaRecibida );
      setEstadoPantalla( "descarte" );
    } );

    sock.on( "listos-jugar", ( mesaRecibida ) => {
      setMesa( mesaRecibida );
      setEstadoPantalla( "en-partida" );
    } );

    sock.on( "reconectar-partida", ( mesaRecibida ) => {
      setMesa( mesaRecibida );
      setMesaId( mesaRecibida._id || mesaRecibida.nombre );
      const estado = mesaRecibida.estado;
      if ( estado === "descarte" ) {
        setEstadoPantalla( "descarte" );
      } else if ( estado === "en-partida" ) {
        setEstadoPantalla( "en-partida" );
      } else if ( estado === "fin-mano" ) {
        setEstadoPantalla( "fin-mano" );
      } else {
        setEstadoPantalla( "mesa" );
      }
    } );


    return () => {
      sock.off( "mesa_creada_exito" )
      sock.off( "jugador-enMesa" )
      sock.off( "confirmacion-registro" )
      sock.off( "ranking-global" )
      sock.off( "error" )
      sock.off( "saliste-mesa" )
      sock.off( "mesa-eliminada" )
      sock.off( "otra-ventana" )
      sock.off( "actualizar-mesa" )
      sock.off( "esperando-descarte" )
      sock.off( "listos-jugar" )
      sock.off( "reconectar-partida" )
    }
  }, [cerrarSesion, mostrarModal] );

  const actualizarRanking = useCallback( () => {
    socketRef.current.emit( "actualizar-ranking" );
  }, [] );

  useEffect( () => {
    const socket = socketRef.current;
    const limpiarListeners = configurarListeners( socket );

    if ( !socket.connected ) {
      socket.connect();
    }

    fetch( `${import.meta.env.VITE_BACKEND_URL}/auth/verify`, {
      method: "POST",
      credentials: "include"
    } )
      .then( res => res.json() )
      .then( data => {
        if ( data.ok ) {
          if ( data.token ) {
            localStorage.setItem( "token", data.token );
            autenticarSocket( data.token );
          }
          guardarCredenciales( data.data );
        } else {
          //cerrarSesion();
        }
      } )
      .catch( () => {
        // Error de red: no cerrar sesión, el servidor puede no estar disponible
      } );

    const handleReconnect = () => {
      const token = localStorage.getItem( "token" );
      if ( token ) {
        socketRef.current.auth = { token, windowId };
      }
    };
    socket.io.on( "reconnect", handleReconnect );

    return () => {
      limpiarListeners();
      socket.io.off( "reconnect", handleReconnect );
    };
  }, [configurarListeners] );

  useEffect( () => {
    const enMesaOPartida = ( estadoPantalla === "en-partida" || estadoPantalla === "mesa" ) && mesa?._id;

    const handleBeforeUnload = ( e ) => {
      if ( enMesaOPartida ) {
        e.preventDefault();
        e.returnValue = "Estás en una mesa. Si salís, perderás tu lugar.";
        return e.returnValue;
      }
    };

    window.addEventListener( "beforeunload", handleBeforeUnload );

    return () => {
      window.removeEventListener( "beforeunload", handleBeforeUnload );
    };
  }, [estadoPantalla, mesa?._id] );

  return (
    <GlobalContext.Provider value={{
      mesa,
      estadoPantalla,
      setEstadoPantalla,
      mesaId,
      setMesa,
      setMesaId,
      nombreJugador,
      nombreGuardado,
      autenticado,
      registrarJugador,
      loginJugador,
      cerrarSesion,
      finPartida,
      setFinPartida,
      error,
      modal,
      mostrarModal,
      cerrarModal,
      ranking,
      actualizarRanking,
      socketRef
    }}>
      {props.children}
    </GlobalContext.Provider>
  )
}

