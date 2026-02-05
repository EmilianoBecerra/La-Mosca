import { useContext, useState } from "react";
import "./CrearMesa.css";
import { GlobalContext } from "../../../../context/GlobalContext";
import { Buttons } from "../../../parts/Buttons";
import { InputCrearMesa } from "../../../parts/inputs/InputCrearMesa";

export function CrearMesa() {
    const { crearMesa } = useContext(GlobalContext);
    const [nombreMesa, setNombreMesa] = useState("");

    const handleCrear = (e) => {
        e.preventDefault();
        const nombreSanitizado = nombreMesa.trim().toLowerCase();
        if (!nombreSanitizado) return;
        crearMesa(nombreSanitizado);
    }

    return (
        <form onSubmit={handleCrear} className="form">
            <InputCrearMesa label={"Nombre Mesa"} setValue={setNombreMesa} />
            <Buttons type={"submit"} label={"Crear Mesa"} />
        </form>
    )
}