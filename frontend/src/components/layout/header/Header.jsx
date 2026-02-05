import { useContext } from "react";
import "./Header.css";
import { GlobalContext } from "../../../context/GlobalContext";


export function Header() {
    const { setEstadoPantalla, cerrarSesionSocket } = useContext(GlobalContext)

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
                    <li onClick={() => { cerrarSesionSocket() }}>Cerrar Sesion</li>
                </ul>
            </nav>
        </header>
    )
}