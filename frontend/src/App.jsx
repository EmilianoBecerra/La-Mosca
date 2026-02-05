import { useContext, useEffect, useState } from 'react'
import './App.css'
import { Footer } from './components/layout/footer/Footer'
import { Header } from './components/layout/header/Header'
import { Main } from './components/layout/main/Main'
import { Modal } from './components/parts/Modal'
import { GlobalContextProvider, GlobalContext } from './context/GlobalContext'

function AppContent() {
  const { autenticado, nombreGuardado, registrarJugador, loginJugador, cerrarSesion } = useContext(GlobalContext);
  const [nombreInput, setNombreInput] = useState("");
  const [codigoInput, setCodigoInput] = useState("");

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
    if (codigoInput.trim().length >= 1) {
      loginJugador(nombreGuardado, codigoInput.trim());
    }
  };

  if (!autenticado) {
    if (nombreGuardado) {
      return (
        <>
          <div className="modal-inicio-overlay">
            <div className="modal-inicio">
              <h2>Hola de nuevo, {nombreGuardado}</h2>
              <p>Ingresa tu código para continuar</p>
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  value={codigoInput}
                  onChange={(e) => setCodigoInput(e.target.value)}
                  placeholder="Código"
                  maxLength={20}
                  minLength={1}
                  autoFocus
                />
                <button type="submit" disabled={codigoInput.trim().length < 1}>
                  Entrar
                </button>
                <button className="btn-otro-usuario" onClick={() => cerrarSesion()}>
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
            <p>Ingresa tu nombre y código para registrarte</p>
            <form onSubmit={handleRegistro}>
              <input
                type="text"
                value={nombreInput}
                onChange={(e) => setNombreInput(e.target.value)}
                placeholder="Tu nombre"
                maxLength={20}
                minLength={2}
                autoFocus
              />
              <input
                type="text"
                value={codigoInput}
                onChange={(e) => setCodigoInput(e.target.value)}
                placeholder="Código"
                maxLength={20}
                minLength={1}
              />
              <button type="submit" disabled={nombreInput.trim().length < 2 || codigoInput.trim().length < 1}>
                Registrarse
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
