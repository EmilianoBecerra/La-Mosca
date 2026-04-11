import { Router } from "express";
import { jugadorModel } from "../model/JugadorModel.js";
import { authToken, generarToken } from "../middleware/jwt.middleware.js";
import { hashPass, verificarPass } from "../utils/user.js";
import passport from "../config/passport.js";
const router = Router();

router.post( "/register", async ( req, res ) => {
  try {
    const { email, nombre, password } = req.body;

    if ( !email || !nombre || !password ) {
      return res.status( 400 ).send( { ok: false, msg: "Faltan campos obligatorios" } );
    }

    if ( email.length > 40 ) {
      return res.status( 400 ).send( { ok: false, msg: "El correo supera el limite de caracteres" } );
    }
    if ( nombre.length > 10 ) {
      return res.status( 400 ).send( { ok: false, msg: "El nombre supera el limite de caracteres(10)" } );
    }

    if ( password.length > 10 ) {
      return res.status( 400 ).send( { ok: false, msg: "La contraseña supera el limite de caracteres(10)" } );
    }

    const nombreSanitizado = nombre.toLocaleLowerCase();
    const nombreExiste = await jugadorModel.findOne( { nombre: nombreSanitizado } );

    if ( nombreExiste ) {
      return res.status( 400 ).send( { ok: false, msg: "Ya existe un jugador con ese nombre" } );
    }

    const hashPassword = await hashPass( password );
    const jugadorDB = await jugadorModel.create( { email, nombre: nombreSanitizado, password: hashPassword } );

    const token = generarToken( { nombre: jugadorDB.nombre } );
    if ( !token ) {
      return res.status( 500 ).send( { ok: false, msg: "Error al generar token" } );
    }

    res.cookie( "token", token, { httpOnly: true, sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", secure: process.env.NODE_ENV === "production" } )
    return res.status( 201 ).send( {
      ok: true,
      msg: "Jugador registrado",
      data: { nombre: jugadorDB.nombre, token }
    } );
  } catch ( error ) {
    console.error( "Error en registro:", error );
    return res.status( 500 ).send( { ok: false, msg: "Error al registrar usuario" } );
  }
} );



router.post( "/login", async ( req, res ) => {
  try {
    const { nombre, password } = req.body;
    if ( !nombre || !password ) {
      return res.status( 400 ).send( { ok: false, msg: "Faltan campos obligatorios" } );
    }
    const nombreSanitizado = nombre.toLocaleLowerCase();
    const jugadorDB = await jugadorModel.findOne( { nombre: nombreSanitizado } );

    if ( !jugadorDB ) {
      return res.status( 400 ).send( { ok: false, msg: "Jugador no existe" } );
    }

    if ( !jugadorDB.password ) {
      return res.status( 400 ).send( { ok: false, msg: "Este jugador usa Google para iniciar sesión" } );
    }

    const verifyPassword = verificarPass( password, jugadorDB.password );

    if ( !verifyPassword ) {
      return res.status( 400 ).send( { ok: false, msg: "Contraseña incorrecta" } );
    }

    const token = generarToken( { nombre: jugadorDB.nombre } );

    if ( !token ) {
      return res.status( 500 ).send( { ok: false, msg: "Error al generar token" } );
    }
    res.cookie( "token", token, { httpOnly: true, sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", secure: process.env.NODE_ENV === "production" } )
    return res.status( 201 ).send( {
      ok: true,
      msg: "Jugador Existe",
      data: { nombre: jugadorDB.nombre, token }
    } );
  } catch ( error ) {
    console.error( "Error en login:", error );
    return res.status( 500 ).send( { ok: false, msg: "Error en el login" } );
  }
} );

router.post( "/verify", authToken, async ( req, res ) => {
  try {
    if ( req.user ) {
      const { nombre } = req.user;
      const jugadorExiste = await jugadorModel.findOne( { nombre } );
      if ( !jugadorExiste ) {
        return res.status( 400 ).send( { ok: false, msg: "Jugador no existe" } );
      }
      const token = generarToken( { nombre: jugadorExiste.nombre } );
      return res.status( 200 ).send( { ok: true, msg: "Jugador existe", data: jugadorExiste.nombre, token } );
    }
    return res.status( 401 ).send( { ok: false, msg: "No autorizado" } );
  } catch ( error ) {
    console.error( "Error en el login", error );
    return res.status( 500 ).send( { ok: false, msg: "Error en el login" } )
  }
} )

router.post( "/logout", ( req, res ) => {
  try {
    res.clearCookie( "token", {
      httpOnly: true, sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", secure: process.env.NODE_ENV === "production"
    } );
    return res.status( 200 ).send( { ok: true, msg: "Sesión finalizada" } );
  } catch ( error ) {
    console.error( "Error al borrar la cookie" );
  }

} )



const FRONTEND_URL = process.env.CORS_ORIGIN || "http://localhost:5173";

router.get( "/google", passport.authenticate( "google", { scope: [ "profile", "email" ], session: false } ) );

router.get( "/google/callback",
  passport.authenticate( "google", { session: false, failureRedirect: `${FRONTEND_URL}?error=google_auth` } ),
  ( req, res ) => {
    try {
      const jugador = req.user as { nombre: string };
      const token = generarToken( { nombre: jugador.nombre } );

      if ( !token ) {
        return res.redirect( `${FRONTEND_URL}?error=token` );
      }

      res.cookie( "token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        secure: process.env.NODE_ENV === "production"
      } );
      return res.redirect( FRONTEND_URL );
    } catch ( error ) {
      console.error( "Error en callback de Google:", error );
      return res.redirect( `${FRONTEND_URL}?error=server` );
    }
  }
);

export default router;
