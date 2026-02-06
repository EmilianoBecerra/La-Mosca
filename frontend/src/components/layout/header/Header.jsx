import { useContext, useState } from "react";
import "./Header.css";
import { GlobalContext } from "../../../context/GlobalContext";


export function Header() {
    const { setEstadoPantalla, cerrarSesionSocket, nombreJugador } = useContext(GlobalContext)
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <header>
            <h1>La Mosca</h1>
            <nav className="nav-list">
                <ul className="ul-header">
                    <li onClick={() => { setEstadoPantalla("lobby") }}>Inicio</li>
                    <li onClick={() => { setEstadoPantalla("ranking") }}>Ranking Global</li>
                    <li className="disabled" title="Proximamente">Torneos</li>
                    <li className="disabled" title="Proximamente">Tienda</li>
                    <li onClick={() => { setEstadoPantalla("instrucciones") }}>Instrucciones</li>
                    <li className="usuario-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
                        😎 {nombreJugador}
                        {menuAbierto && (
                            <div className="usuario-menu" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => { cerrarSesionSocket(); setMenuAbierto(false); }}>
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    )
}