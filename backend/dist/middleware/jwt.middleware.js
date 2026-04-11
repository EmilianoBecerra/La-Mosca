import jwt, {} from "jsonwebtoken";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const generarToken = (user) => {
    if (PRIVATE_KEY !== undefined) {
        const token = jwt.sign({ email: user.email, nombre: user.nombre }, PRIVATE_KEY, { expiresIn: "24h" });
        return token;
    }
};
export const authToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(400).send({ ok: false, msg: "Usuario no registrado" });
    if (typeof (token) === "string" && PRIVATE_KEY !== undefined) {
        jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
            if (error)
                return res.status(403).send({ error: "Error al comprobar credenciales" });
            req.user = credentials;
            next();
        });
    }
};
//# sourceMappingURL=jwt.middleware.js.map