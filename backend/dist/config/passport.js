import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { jugadorModel } from "../model/JugadorModel.js";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        let jugador = await jugadorModel.findOne({ googleId: profile.id });
        if (jugador)
            return done(null, jugador);
        const email = profile.emails?.[0]?.value;
        if (!email)
            return done(new Error("Google no devolvió un email"));
        jugador = await jugadorModel.findOne({ email });
        if (jugador) {
            jugador.googleId = profile.id;
            await jugador.save();
            return done(null, jugador);
        }
        const emailPrefix = email.split("@")[0] ?? "jugador";
        let nombreBase = (profile.displayName || emailPrefix)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .slice(0, 10);
        if (!nombreBase)
            nombreBase = "jugador";
        let nombre = nombreBase;
        let sufijo = 1;
        while (await jugadorModel.findOne({ nombre })) {
            nombre = nombreBase.slice(0, 9) + sufijo;
            sufijo++;
        }
        const nuevoJugador = await jugadorModel.create({ email, nombre, googleId: profile.id });
        return done(null, nuevoJugador);
    }
    catch (error) {
        return done(error);
    }
}));
export default passport;
//# sourceMappingURL=passport.js.map