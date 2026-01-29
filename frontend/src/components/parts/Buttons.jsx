import "./Buttons.css"

export function Buttons({ label, type, onClick}) {
    return (
        <button className="btn-crear-mesa" type={type} onClick={onClick}>{label}</button>
    )
}