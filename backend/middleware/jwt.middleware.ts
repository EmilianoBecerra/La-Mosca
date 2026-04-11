import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload, type VerifyErrors } from "jsonwebtoken";
import type { Jugador } from "../interfaces.js";

const PRIVATE_KEY = process.env.PRIVATE_KEY;

interface USERJWT {
  email?: string,
  nombre: string,
}

export const generarToken = (user: USERJWT) => {
  if (PRIVATE_KEY !== undefined) {
    const token = jwt.sign({ email: user.email, nombre: user.nombre }, PRIVATE_KEY, { expiresIn: "24h" });
    return token;
  }
}

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(400).send({ ok: false, msg: "Usuario no registrado" });
  if (typeof (token) === "string" && PRIVATE_KEY !== undefined) {
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
      if (error) return res.status(403).send({ error: "Error al comprobar credenciales" })
      req.user = credentials as JwtPayload;
      next()
    })
  }
}

