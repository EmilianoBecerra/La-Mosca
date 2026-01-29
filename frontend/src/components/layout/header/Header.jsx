import { useContext } from "react";
import "./Header.css";
import { GlobalContext } from "../../../context/GlobalContext";


export function Header() {
    const { setEstadoPantalla } = useContext(GlobalContext)

    return (
        <header>
            <h1>La Mosca</h1>
            <nav className="nav-list">
                <ul className="ul-header">
                    <li onClick={() => { setEstadoPantalla("lobby") }}>Inicio</li>
                    <li onClick={() => { setEstadoPantalla("crear-mesa") }}>Crear Mesa</li>
                    <li onClick={() => { setEstadoPantalla("ranking") }}>Ranking Global</li>
                    <li onClick={() => { setEstadoPantalla("torneos") }}>Torneos</li>
                    <li onClick={() => { setEstadoPantalla("tienda") }}>Tienda</li>
                    <li onClick={() => { setEstadoPantalla("instrucciones") }}>Instrucciones</li>
                </ul>
            </nav>
        </header>
    )
}