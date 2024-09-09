import cors from "cors";

// Configura el middleware CORS para el servidor Express
export const config = (server) => {
    server.use(cors({
        origin: process.env.FRONTEND_HOST, // Especifica un origen permitido
        methods: "GET,PUT,POST,DELETE", // Especifica los métodos HTTP permitidos
    }));
};