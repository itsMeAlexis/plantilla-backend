import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import Usuarios from "../models/bdp_busquedas.model.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "usuario",
      passwordField: "contrasena",
    },
    async (usuario, contrasena, done) => {
      try {
        const user = await Usuarios.findOne({ where: { usuario } });
        if (!user) {
          return done(null, false, { message: "Usuarios no encontrado" });
        }
        const isMatch = await user.validarContrasena(contrasena);
        if (!isMatch) {
          return done(null, false, { message: "Contraseña incorrecta" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await Usuarios.findByPk(jwt_payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;
