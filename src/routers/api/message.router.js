import BaseRouter from "../base.router.js";
import MessageController from "../../controllers/message.controller.js";

export default class MessageRouter extends BaseRouter {
    #messageController;

    constructor() {
        super();
        this.#messageController = new MessageController();
    }

    initialize() {
        const router = this.getRouter();

        // Define las rutas y asocia las funciones correspondientes
        this.addPostRoute("/send", [], (req, res) => this.#messageController.send(req, res));

        // Middleware para manejar errores
        // eslint-disable-next-line no-unused-vars
        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}