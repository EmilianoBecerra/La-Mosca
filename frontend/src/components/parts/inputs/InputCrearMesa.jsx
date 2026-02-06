import "./InputCrearMesa.css"

export function InputCrearMesa({ label, children, setValue }) {
    return (
        <div className="label-input">
            <label>{label}
                <input type="text" required maxLength={20} minLength={2} onChange={(e) => setValue(e.target.value.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, ""))}/>
               {children}
            </label>
        </div>
    )
}