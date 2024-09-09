import BaseRouter from "./base.router.js";

export default class HomeViewRouter extends BaseRouter {

    constructor() {
        super();
        this.initialize();
    }

    initialize() {
        const router = this.getRouter();

        // Define las rutas y asocia las funciones correspondientes
        this.addGetRoute("/", [], (req, res) => this.#getTemplateHome(req, res));

        // Middleware de manejo de errores
        // eslint-disable-next-line no-unused-vars
        router.use((error, req, res, next) => {
            res.sendError(error);
        });
    }

    // Maneja la solicitud GET para la página de inicio
    #getTemplateHome(req, res) {
        res.status(200).render("index", { title: "Inicio" });
    }
}