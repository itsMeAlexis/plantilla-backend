// import passport from "passport";
// import { Strategy as LocalStrategy } from "passport-local";
// import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
// import Usuarios from "../models/pd_usuarios.model.js";
// import config from "./config.js";

// const opts = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: config.JWT_SECRET_KEY,
// };

// passport.use(
//   new JwtStrategy(opts, async (jwt_payload, done) => {
//     try {
//       const user = await Usuarios.findByPk(jwt_payload.id_usuario);
//       if (user) {
//         return done(null, user);
//       }
//       return done(null, false);
//     } catch (err) {
//       return done(err, false);
//     }
//   })
// );

// export default passport;
