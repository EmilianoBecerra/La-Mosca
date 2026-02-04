import "./Main.css";
import { Lobby } from "./lobby/Lobby";
import { CrearMesa } from "./crearMesas/CrearMesa";
import { Instrucciones } from "./instrucciones/Instrucciones";
import { Ranking } from "./ranking/Ranking";
import { useContext } from "react";
import { GlobalContext } from "../../../context/GlobalContext";
import { Mesa } from "./mesa/Mesa";
import { Juego } from "./juego/Juego";
import { FinMano } from "./juego/FinMano";
import { FinPartida } from "./juego/FinPartida";

export function Main() {
    const { estadoPantalla, mesaId } = useContext(GlobalContext);
    return (
        <main>
            {estadoPantalla === "lobby" && <Lobby />}
            {estadoPantalla === "crear-mesa" && <CrearMesa />}
            {estadoPantalla === "instrucciones" && <Instrucciones />}
            {estadoPantalla === "ranking" && <Ranking />}
            {estadoPantalla === "mesa" && <Mesa id={mesaId} />}
            {estadoPantalla === "descarte" && <Juego />}
            {estadoPantalla === "en-partida" && <Juego />}
            {estadoPantalla === "fin-mano" && <FinMano />}
            {estadoPantalla === "fin-partida" && <FinPartida />}
        </main>
    );
}
