import { useContext, useEffect, useState } from 'react'
import './App.css'
import { Footer } from './components/layout/footer/Footer'
import { Header } from './components/layout/header/Header'
import { Main } from './components/layout/main/Main'
import { Modal } from './components/parts/Modal'
import { GlobalContextProvider, GlobalContext } from './context/GlobalContext'

const sanitizar = (valor) => valor.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, "");

function AppContent() {
  const { autenticado, nombreGuardado, registrarJugador, loginJugador, cerrarSesion } = useContext(GlobalContext);
  const [nombreInput, setNombreInput] = useState("");
  const [codigoInput, setCodigoInput] = useState("");
  const [modoLogin, setModoLogin] = useState(false);

  useEffect(() => {
    if (!autenticado) {
      setCodigoInput("");
    }
  }, [autenticado]);

  const handleRegistro = (e) => {
    e.preventDefault();
    if (nombreInput.trim().length >= 2 && codigoInput.trim().length >= 1) {
      registrarJugador(nombreInput.trim(), codigoInput.trim());
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const nombre = nombreGuardado || nombreInput.trim();
    if (nombre.length >= 2 && codigoInput.trim().length >= 1) {
      loginJugador(nombre, codigoInput.trim());
    }
  };

  const toggleModo = () => {
    setModoLogin(!modoLogin);
    setCodigoInput("");
  };

  if (!autenticado) {
    if (nombreGuardado) {
      return (
        <>
          <div className="modal-inicio-overlay">
            <div className="modal-inicio">
              <h2>Hola de nuevo, <span className='nombreUsuario'>{nombreGuardado}</span></h2>
              <p>Ingresa tu contraseña para continuar</p>
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  value={codigoInput}
                  onChange={(e) => setCodigoInput(sanitizar(e.target.value))}
                  placeholder="Contraseña"
                  maxLength={20}
                  minLength={1}
                  autoFocus
                />
                <button type="submit" disabled={codigoInput.trim().length < 1}>
                  Entrar
                </button>
                <button type="button" className="btn-otro-usuario" onClick={() => cerrarSesion()}>
                  Entrar con otro usuario
                </button>
              </form>
            </div>
          </div>
          <Modal />
        </>
      );
    }

    return (
      <>
        <div className="modal-inicio-overlay">
          <div className="modal-inicio">
            <h2>Bienvenido a La Mosca</h2>
            <p>{modoLogin ? "Ingresá tus datos para iniciar sesión" : "Ingresá tu usuario y contraseña para registrarte"}</p>
            <form onSubmit={modoLogin ? handleLogin : handleRegistro}>
              <input
                type="text"
                value={nombreInput}
                onChange={(e) => setNombreInput(sanitizar(e.target.value))}
                placeholder="Usuario"
                maxLength={20}
                minLength={2}
                autoFocus
              />
              <input
                type="text"
                value={codigoInput}
                onChange={(e) => setCodigoInput(sanitizar(e.target.value))}
                placeholder="Contraseña"
                maxLength={20}
                minLength={1}
              />
              <button type="submit" disabled={nombreInput.trim().length < 2 || codigoInput.trim().length < 1}>
                {modoLogin ? "Iniciar sesión" : "Registrarse"}
              </button>
              <button type="button" className="btn-otro-usuario" onClick={toggleModo}>
                {modoLogin ? "No tengo cuenta" : "Ya tengo cuenta"}
              </button>
            </form>
          </div>
        </div>
        <Modal />
      </>
    );
  }

  return (
    <>
      <Header />
      <Main />
      <Footer />
      <Modal />
    </>
  );
}

function App() {
  return (
    <div className='layout'>
      <GlobalContextProvider>
        <AppContent />
      </GlobalContextProvider>
    </div>
  )
}

export default App
