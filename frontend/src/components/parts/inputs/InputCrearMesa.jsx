import "./InputCrearMesa.css"

export function InputCrearMesa({ label, children, setValue, type, required = true }) {
    return (
        <div className="label-input">
            <label>{label}
                <input type={type} required={required} maxLength={20} minLength={required ? 2 : undefined} onChange={(e) => setValue(e.target.value.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, ""))}/>
               {children}
            </label>
        </div>
    )
}