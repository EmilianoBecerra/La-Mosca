import type { JwtPayload } from "jsonwebtoken";
import type { Mesa, Jugador } from "../interfaces.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload | undefined;
  }
}

export type DataReturn =
  | { ok: true, msg: string, data: { mesa?: Mesa, jugador?: Jugador } }
  | { ok: false, msg: string }