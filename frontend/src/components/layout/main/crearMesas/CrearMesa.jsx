import { useContext, useState } from "react";
import "./CrearMesa.css";
import { GlobalContext } from "../../../../context/GlobalContext";
import { Buttons } from "../../../parts/Buttons";
import { InputCrearMesa } from "../../../parts/inputs/InputCrearMesa";

export function CrearMesa() {
  const { socketRef } = useContext(GlobalContext);
  const [nombreMesa, setNombreMesa] = useState("");
  const [passwordMesa, setPasswordMesa] = useState("");

  const handleCrear = (e) => {
    e.preventDefault();
    const nombreSanitizado = nombreMesa.trim().toLowerCase();
    if (!nombreSanitizado) return;
    const nombre = localStorage.getItem("nombreJugador");
    if (!nombre) {
      console.error("No hay jugador registrado");
      return;
    }
    socketRef.current.emit("crear-mesa", nombre, nombreSanitizado, passwordMesa);
  }

  return (
    <form onSubmit={handleCrear} className="form">
      <InputCrearMesa label={"Nombre Mesa"} setValue={setNombreMesa} type={"text"} />
      <InputCrearMesa label={"*Dejar vacío para mesa pública"} setValue={setPasswordMesa} type={"password"} required={false} />
      <Buttons type={"submit"} label={"Crear Mesa"} />
    </form>
  )
}