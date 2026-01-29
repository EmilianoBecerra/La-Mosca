import { useContext, useState } from 'react'
import './App.css'
import { Footer } from './components/layout/footer/Footer'
import { Header } from './components/layout/header/Header'
import { Main } from './components/layout/main/Main'
import { Modal } from './components/parts/Modal'
import { GlobalContextProvider, GlobalContext } from './context/GlobalContext'

function AppContent() {
  const { nombreJugador, registrarJugador } = useContext(GlobalContext);
  const [nombreInput, setNombreInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombreInput.trim().length >= 2) {
      registrarJugador(nombreInput.trim());
    }
  };

  if (!nombreJugador) {
    return (
      <>
        <div className="modal-inicio-overlay">
          <div className="modal-inicio">
            <h2>Bienvenido a La Mosca</h2>
            <p>Ingresa tu nombre para comenzar</p>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={nombreInput}
                onChange={(e) => setNombreInput(e.target.value)}
                placeholder="Tu nombre"
                maxLength={20}
                minLength={2}
                autoFocus
              />
              <button type="submit" disabled={nombreInput.trim().length < 2}>
                Entrar
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
