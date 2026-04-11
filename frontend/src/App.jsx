import { useContext, useEffect, useState } from 'react';
import './App.css';
import { Footer } from './components/layout/footer/Footer';
import { Header } from './components/layout/header/Header';
import { Main } from './components/layout/main/Main';
import { Modal } from './components/parts/Modal';
import { GlobalContextProvider, GlobalContext } from './context/GlobalContext';

const sanitizar = ( valor ) => valor.replace( /[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, "" );

function AppContent() {
  const { autenticado, nombreGuardado, registrarJugador, loginJugador, cerrarSesion } = useContext( GlobalContext );
  const [nombreInput, setNombreInput] = useState( "" );
  const [inputPassword, setInputPassword] = useState( "" );
  const [inputEmail, setInputEmail] = useState( "" );
  const [modoLogin, setModoLogin] = useState( true );

  useEffect( () => {
    if ( !autenticado ) {
      setInputPassword( "" );
    }
  }, [autenticado] );

  const handleRegistro = ( event ) => {
    event.preventDefault();
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if ( nombreInput.trim().length >= 2 && inputPassword.trim().length >= 1 && regex.test( inputEmail.trim() ) ) {
      registrarJugador( inputEmail.trim(), nombreInput.trim(), inputPassword.trim() );
    }
  };

  const handleLogin = ( event ) => {
    event.preventDefault();
    const nombre = nombreGuardado || nombreInput.trim();
    if ( nombre.length >= 2 && inputPassword.trim().length >= 5 ) {
      loginJugador( nombre, inputPassword.trim() );
    }
  };

  const toggleModo = () => {
    setModoLogin( !modoLogin );
    setInputPassword( "" );
  };

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  if ( !autenticado ) {
    if ( nombreGuardado ) {
      return (
        <>
          <div className="modal-inicio-overlay">
            <div className="modal-inicio">
              <h2>Hola de nuevo, <span className='nombreUsuario'>{nombreGuardado}</span></h2>
              <p>Ingresa tu contraseña para continuar</p>
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={inputPassword}
                  onChange={( e ) => setInputPassword( sanitizar( e.target.value ) )}
                  placeholder="Contraseña"
                  maxLength={20}
                  minLength={1}
                  autoFocus
                />
                <button type="submit" className='registrarse' disabled={inputPassword.trim().length < 1}>
                  Entrar
                </button>
              </form>
              <div className="separador"><span>o</span></div>
              <button type="button" className="btn-google" onClick={handleGoogle}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                Continuar con Google
              </button>
              <button type="button" className="btn-otro-usuario" onClick={() => cerrarSesion()}>
                Entrar con otro usuario
              </button>
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
            <p>{modoLogin ? "Registrate ingresando usuario y contraseña." : "Ingresá tu usuario y contraseña para registrarte"}</p>
            <form onSubmit={!modoLogin ? handleLogin : handleRegistro}>
              {modoLogin ?
                < input
                  type="text"
                  value={inputEmail}
                  onChange={( e ) => setInputEmail( e.target.value )}
                  required
                  placeholder='Email'
                  maxLength={30}
                  minLength={10}
                  autoFocus
                /> : ""
              }
              <input
                type="text"
                value={nombreInput}
                onChange={( e ) => setNombreInput( sanitizar( e.target.value ) )}
                placeholder="Usuario"
                maxLength={20}
                minLength={2}
                required
              />
              <input
                type="password"
                value={inputPassword}
                onChange={( e ) => setInputPassword( sanitizar( e.target.value ) )}
                placeholder="Contraseña"
                maxLength={20}
                minLength={1}
                required
              />
              <button type="submit" className='registrarse' disabled={nombreInput.trim().length < 2 || inputPassword.trim().length < 1}>
                {!modoLogin ? "Iniciar sesión" : "Registrarse"}
              </button>
            </form>
            <button type="button" className="btn-otro-usuario" onClick={toggleModo} >
              {modoLogin ? "Ya tengo cuenta" : "Registrate"}
            </button>
            <div className="separador"><span>o</span></div>
            <button type="button" className="btn-google" onClick={handleGoogle}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Continuar con Google
            </button>
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
