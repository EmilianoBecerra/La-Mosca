import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import "./Modal.css";

export function Modal() {
  const { modal, cerrarModal } = useContext(GlobalContext);

  if (!modal.visible) return null;

  return (
    <div className="modal-overlay" onClick={cerrarModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-icon">
            {modal.tipo === "error" ? "⚠️" : "ℹ️"}
          </span>
          <h3>{modal.tipo === "error" ? "Error" : "Aviso"}</h3>
        </div>
        <div className="modal-body">
          <p>{modal.mensaje}</p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn" onClick={cerrarModal}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
