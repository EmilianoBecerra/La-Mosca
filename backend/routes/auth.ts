import { Router } from "express";
import { jugadorModel } from "../model/JugadorModel.js";
import { authToken, generarToken } from "../middleware/jwt.middleware.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { nombre, codigo } = req.body;
    if (!nombre || !codigo) {
      return res.status(400).send({ ok: false, msg: "Faltan campos obligatorios" });
    }

    const nombreSanitizado = nombre.toLocaleLowerCase();
    const nombreExiste = await jugadorModel.findOne({ nombre: nombreSanitizado });

    if (nombreExiste) {
      return res.status(400).send({ ok: false, msg: "Ya existe un jugador con ese nombre" });
    }

    const jugadorBD = await jugadorModel.create({ nombre: nombreSanitizado, codigo });
    const token = generarToken({ nombre: jugadorBD.nombre, password: codigo });

    if (!token) {
      return res.status(500).send({ ok: false, msg: "Error al generar token" });
    }

    return res.status(201).send({
      ok: true,
      msg: "Jugador registrado",
      data: { nombre: jugadorBD.nombre, token }
    });
  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).send({ ok: false, msg: "Error al registrar usuario" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { nombre, codigo } = req.body;
    if (!nombre || !codigo) {
      return res.status(400).send({ ok: false, msg: "Faltan campos obligatorios" });
    }

    const nombreSanitizado = nombre.toLocaleLowerCase();
    const jugadorDB = await jugadorModel.findOne({ nombre: nombreSanitizado });

    if (!jugadorDB) {
      return res.status(400).send({ ok: false, msg: "Jugador no existe" });
    }

    if (jugadorDB.codigo !== codigo) {
      return res.status(400).send({ ok: false, msg: "Contraseña incorrecta" });
    }

    const token = generarToken({ nombre: jugadorDB.nombre, password: codigo });

    if (!token) {
      return res.status(500).send({ ok: false, msg: "Error al generar token" });
    }

    return res.status(200).send({
      ok: true,
      msg: "Login exitoso",
      data: { nombre: jugadorDB.nombre, token }
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).send({ ok: false, msg: "Error en el login" });
  }
});

router.post("/verify", authToken, async (req, res) => {
  try {
    if (req.user) {
      const { nombre } = req.user;
      const jugadorExiste = await jugadorModel.findOne({ nombre });
      if(!jugadorExiste){
        return res.status(400).send({ok: false, msg: "Jugador no existe"});
      }
      return res.status(200).send({ok:true, msg:"Jugador existe", data: nombre});
    }
    return res.status(401).send({ok: false, msg: "No autorizado"});
  } catch (error) {
    console.error("Error en el login", error);
    return res.status(500).send({ ok: false, msg: "Error en el login" })
  }
})



export default router;
