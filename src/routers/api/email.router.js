import BaseRouter from "../base.router.js";
import uploader from "../../utils/uploader.js";
import EmailController from "../../controllers/email.controller.js";

export default class EmailRouter extends BaseRouter {
    #emailController;

    constructor() {
        super();
        this.#emailController = new EmailController();
    }

    initialize() {
        const router = this.getRouter();

        // Define las rutas y asocia las funciones correspondientes
        this.addPostRoute("/send", [], uploader.single("file"), (req, res) => this.#emailController.send(req, res));

        // Middleware para manejar errores
        // eslint-disable-next-line no-unused-vars
        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}