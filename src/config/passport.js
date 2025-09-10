import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import Usuarios from "../models/PD_usuarios.model.js";

// Estrategia Local para autenticación con usuario y contraseña
passport.use(
  new LocalStrategy(
    {
      usernameField: "usuario",
      passwordField: "password",
    },
    async (usuario, password, done) => {
      try {
        const user = await Usuarios.findOne({ where: { usuario } });
        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" });
        }
        const isMatch = await user.validarContrasena(password);
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
      const user = await Usuarios.findByPk(jwt_payload.IdUsuario);
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
