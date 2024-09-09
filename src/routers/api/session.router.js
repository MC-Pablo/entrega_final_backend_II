import BaseRouter from "../base.router.js";
import SessionController from "../../controllers/session.controller.js";
import { generateToken } from "../../middlewares/auth.middleware.js";
import { STANDARD } from "../../constants/roles.constant.js";

export default class SessionRouter extends BaseRouter {
    #sessionController;

    constructor() {
        super();
        this.#sessionController = new SessionController();
    }

    initialize() {
        const router = this.getRouter();

        // Define las rutas y asocia las funciones correspondientes
        this.addPostRoute("/login", [], generateToken, (req, res) => this.#sessionController.login(req, res));
        this.addGetRoute("/current", [STANDARD], (req, res) => this.#sessionController.getCurrentUser(req, res));

        // Middleware para manejar errores
        // eslint-disable-next-line no-unused-vars
        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}