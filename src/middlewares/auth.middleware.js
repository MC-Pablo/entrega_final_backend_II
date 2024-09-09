import jwt from "jsonwebtoken";
import passport from "passport";
import UserService from "../services/user.service.js";
import { JWT_TRANSLATIONS } from "../constants/messages.constant.js";

const userService = new UserService();

// Middleware para generar un token de acceso para un usuario autenticado
export const generateToken = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Busca al usuario por email y contraseña
        const userFound = await userService.findOneByEmailAndPassword(email, password);

        // Genera un token JWT que expira en 2 horas
        const token = jwt.sign({ id: userFound.id }, process.env.SECRET_KEY, { expiresIn: "2h" });

        // Coloca el token en el request
        req.token = token;

        // Coloca el token en una cookie que expira en 2 horas
        res.cookie("token", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });

        // Llama al siguiente middleware
        next();
    } catch (error) {
        next(error);
    }
};

// Middleware para verificar la autenticación del usuario
export const checkAuth = (req, res, next) => {
    // Determina la estrategia de autenticación JWT según la presencia del token en las cookies
    const jwtStrategy = req.cookies["token"] ? "jwt-cookie" : "jwt-header";

    // Autentica al usuario utilizando la estrategia proporcionada por Passport
    passport.authenticate(jwtStrategy, { session: false }, (error, user, info) => {
        if (error) return next(error);

        // Si el usuario no se ha autenticado, retorna un mensaje de error 401
        if (!user) {
            return next(new Error(JWT_TRANSLATIONS[info.message] ?? info.message));
        }

        // Guarda información del usuario en la request para posterior su uso
        req.id = user.id;
        req.roles = user.roles;
        req.email = user.email;

        // Llama al siguiente middleware
        next();
    })(req, res, next);
};